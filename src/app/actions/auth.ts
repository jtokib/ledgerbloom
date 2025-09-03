'use server';

import { setUserClaims, updateUserRole, clearUserClaims } from '@/lib/auth/claims';
import { requireRole, getAuthenticatedUser } from '@/lib/auth/middleware';
import { createOrganization, getOrganization } from '@/services/organizations';
import { createUser as createUserInFirestore } from '@/services/users';
import { createAuditLog } from '@/services/audit';
import { revalidatePath } from 'next/cache';

/**
 * Create a new organization and set the creating user as admin
 */
export async function createOrganizationWithAdmin(
  userId: string, 
  organizationName: string,
  userEmail: string,
  displayName?: string
) {
  try {
    // Create organization
    const organization = await createOrganization({
      name: organizationName,
      plan: 'free'
    });

    // Set custom claims for the user
    await setUserClaims(userId, {
      role: 'admin',
      organizationId: organization.id
    });

    // Create user record in Firestore
    await createUserInFirestore({
      id: userId,
      email: userEmail,
      displayName,
      role: 'admin',
      organizationId: organization.id
    });

    // Create audit log
    await createAuditLog({
      user: userEmail,
      action: 'organization.create',
      organizationId: organization.id,
      details: {
        entityType: 'organization',
        entityId: organization.id,
        message: `Created organization: ${organizationName}`
      }
    });

    revalidatePath('/dashboard');
    
    return { 
      success: true, 
      organization,
      message: 'Organization created successfully' 
    };
  } catch (error) {
    console.error('Failed to create organization:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create organization' 
    };
  }
}

/**
 * Add user to organization with specific role
 */
export async function addUserToOrganization(
  targetUserId: string,
  targetUserEmail: string,
  role: 'admin' | 'manager' | 'viewer'
) {
  try {
    // Check if current user is admin
    const currentUser = await requireRole('admin');
    
    // Set custom claims for target user
    await setUserClaims(targetUserId, {
      role,
      organizationId: currentUser.claims.organizationId
    });

    // Create/update user record in Firestore
    await createUserInFirestore({
      id: targetUserId,
      email: targetUserEmail,
      role,
      organizationId: currentUser.claims.organizationId
    });

    // Create audit log
    await createAuditLog({
      user: currentUser.email!,
      action: 'user.add_to_organization',
      organizationId: currentUser.claims.organizationId,
      details: {
        entityType: 'user',
        entityId: targetUserId,
        message: `Added user ${targetUserEmail} with role ${role}`
      }
    });

    revalidatePath('/dashboard/settings');
    
    return { 
      success: true, 
      message: 'User added to organization successfully' 
    };
  } catch (error) {
    console.error('Failed to add user to organization:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to add user to organization' 
    };
  }
}

/**
 * Update user role (admin only)
 */
export async function updateUserRoleAction(
  targetUserId: string,
  newRole: 'admin' | 'manager' | 'viewer'
) {
  try {
    // Check if current user is admin
    const currentUser = await requireRole('admin');
    
    // Prevent admins from demoting themselves
    if (currentUser.uid === targetUserId && newRole !== 'admin') {
      return {
        success: false,
        error: 'You cannot change your own admin role'
      };
    }
    
    // Update role in custom claims
    await updateUserRole(targetUserId, newRole);

    // Create audit log
    await createAuditLog({
      user: currentUser.email!,
      action: 'user.update_role',
      organizationId: currentUser.claims.organizationId,
      details: {
        entityType: 'user',
        entityId: targetUserId,
        message: `Updated user role to ${newRole}`
      }
    });

    revalidatePath('/dashboard/settings');
    
    return { 
      success: true, 
      message: 'User role updated successfully' 
    };
  } catch (error) {
    console.error('Failed to update user role:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update user role' 
    };
  }
}

/**
 * Remove user from organization (admin only)
 */
export async function removeUserFromOrganization(targetUserId: string) {
  try {
    // Check if current user is admin
    const currentUser = await requireRole('admin');
    
    // Prevent admins from removing themselves
    if (currentUser.uid === targetUserId) {
      return {
        success: false,
        error: 'You cannot remove yourself from the organization'
      };
    }
    
    // Clear custom claims
    await clearUserClaims(targetUserId);

    // Create audit log
    await createAuditLog({
      user: currentUser.email!,
      action: 'user.remove_from_organization',
      organizationId: currentUser.claims.organizationId,
      details: {
        entityType: 'user',
        entityId: targetUserId,
        message: 'Removed user from organization'
      }
    });

    revalidatePath('/dashboard/settings');
    
    return { 
      success: true, 
      message: 'User removed from organization successfully' 
    };
  } catch (error) {
    console.error('Failed to remove user from organization:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to remove user from organization' 
    };
  }
}