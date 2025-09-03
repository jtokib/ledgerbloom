# 🤖 CLAUDE CODE ASSISTANT CONFIGURATION

**Project**: LedgerBloom - AI-Powered Inventory Management System  
**Last Updated**: September 3, 2025  
**Status**: Production Ready  

---

## 🎯 PROJECT OVERVIEW

LedgerBloom is a multi-tenant SaaS inventory management system with AI-powered insights, real-time tracking, and seamless integrations. Built with Next.js 15, Firebase, and AI capabilities.

**Key Features:**
- ✅ Multi-tenant organization architecture
- ✅ Firebase Auth with custom claims RBAC
- ✅ Real-time inventory tracking with ledger-based system
- ✅ AI-powered optimization suggestions
- ✅ Modern TypeScript/React interface
- ✅ Comprehensive security rules

---

## 🏗️ ARCHITECTURE & TECH STACK

### **Frontend**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **UI**: TailwindCSS + shadcn/ui components
- **Auth**: Firebase Auth v10 with custom claims
- **State**: React Server Components + Client components

### **Backend**
- **Database**: Firebase Firestore with security rules
- **Auth**: Firebase Authentication with custom claims
- **Functions**: Firebase Cloud Functions (future)
- **AI**: Firebase Genkit with custom flows
- **Integrations**: ShipStation webhooks (future)

### **DevOps & Quality**
- **TypeScript**: Zero compilation errors enforced
- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier (via ESLint)
- **Git**: GitHub with automated workflows
- **Testing**: Comprehensive test strategy (future)

---

## 📁 PROJECT STRUCTURE

```
src/
├── app/                    # Next.js 15 App Router
│   ├── actions.ts         # Server Actions (all multi-tenant)
│   ├── dashboard/         # Protected dashboard pages
│   ├── auth/             # Authentication pages
│   └── globals.css       # Global styles
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui base components
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Dashboard-specific components
│   └── [domain]/        # Domain-specific components
├── lib/                 # Shared utilities
│   ├── types.ts        # TypeScript type definitions
│   ├── auth/           # Authentication utilities
│   ├── firebase.ts     # Firebase client config
│   └── utils.ts        # Utility functions
├── services/           # Data access layer (all org-scoped)
│   ├── products.ts    # Product management
│   ├── inventory.ts   # Inventory tracking
│   ├── movements.ts   # Movement history
│   └── [domain].ts    # Other domain services
├── ai/                # AI flows and tools
│   └── flows/         # Genkit AI flows
└── hooks/             # Custom React hooks
```

---

## 🛠️ DEVELOPMENT COMMANDS

### **Quality Assurance**
```bash
# TypeScript compilation check (CRITICAL - must pass)
npx tsc --noEmit

# Linting and formatting
npm run lint

# Build verification
npm run build

# Development server
npm run dev
```

### **Git Workflow**
```bash
# Standard development cycle
git add .
git commit -m "feat: description 🤖 Generated with Claude Code"
git push origin main
```

---

## 🔒 AUTHENTICATION & SECURITY

### **Multi-Tenant Architecture**
- All entities scoped to `organizationId`
- Firebase Auth custom claims for RBAC
- Server-side auth verification via middleware
- Client-side claims access via `useCustomClaims` hook

### **Security Implementation**
```typescript
// Server-side auth check
const organizationId = await getCurrentOrganizationId();
const data = await getProducts(organizationId);

// Client-side auth check  
const { claims } = useCustomClaims();
if (!claims?.organizationId) return <AuthError />;
```

### **Firestore Security Rules**
- Organization-scoped data access
- Role-based permissions (admin/manager/viewer)
- Custom claims verification
- Append-only inventory movements

---

## 🔄 DEVELOPMENT WORKFLOW

### **TypeScript Quality Gates** ⭐
**CRITICAL**: All TypeScript compilation errors MUST be fixed before committing.

```bash
# ALWAYS run before committing
npx tsc --noEmit
# Must return no errors (zero error policy)
```

### **Architecture Patterns**
1. **Server Components**: Use for data fetching with `getCurrentOrganizationId()`
2. **Client Components**: Use `useCustomClaims()` for auth context
3. **Server Actions**: Always include `organizationId` as first parameter
4. **Services**: All functions require `organizationId` parameter
5. **Components**: Pass `organizationId` to all server actions

### **Error Prevention Strategy**
- Incremental migrations for architectural changes
- TypeScript strict mode enforced
- Pre-commit hooks for compilation checks
- Systematic testing of breaking changes
- Migration checklists for major refactors

---

## 📋 COMPLETED FEATURES

### ✅ **Sprint 0: Planning & Setup**
- Project initialization and architecture planning
- Technology stack selection and configuration
- Development environment setup

### ✅ **Sprint 1: Multi-Tenant Foundation**
- Organization-scoped data model implementation
- All entities updated with `organizationId` field
- Multi-tenant service layer architecture
- Organization management system

### ✅ **Sprint 2: Security & Auth**
- Firebase Auth custom claims implementation
- RBAC system with token-based permissions
- Firestore security rules using auth tokens
- Client and server-side auth utilities

### ✅ **HOTFIX: TypeScript Error Resolution**
- **38 TypeScript compilation errors fixed** (originally 21)
- All dashboard pages updated for organization scoping
- All components updated with proper auth patterns
- Root cause analysis and prevention strategy documented
- Zero compilation errors achieved

---

## 🚀 UPCOMING FEATURES

### **Sprint 3: Functions & Tasks**
- Firebase Cloud Functions architecture
- Cloud Tasks queue processing
- Webhook idempotency system
- Error handling and retry logic

### **Sprint 4: Advanced Inventory**
- Ledger-based inventory system
- Materialized view maintenance
- Performance optimization
- Audit trail implementation

---

## 🔧 CLAUDE CODE ASSISTANT GUIDELINES

### **Development Principles**
1. **TypeScript First**: Zero compilation errors policy
2. **Security by Design**: Always include organization scoping
3. **Incremental Changes**: Avoid big-bang refactoring
4. **Pattern Consistency**: Follow established architectural patterns
5. **Quality Gates**: Pre-commit checks and validation

### **Code Standards**
- Use TypeScript strict mode
- Follow Next.js 15 App Router patterns
- Implement proper error handling
- Include JSDoc comments for complex functions
- Maintain consistent naming conventions

### **Testing Strategy**
```bash
# Quality assurance checklist
npx tsc --noEmit          # TypeScript compilation
npm run lint              # ESLint checks
npm run build             # Build verification
```

### **Common Patterns**
```typescript
// Server Component Pattern
export default async function Page() {
  const organizationId = await getCurrentOrganizationId();
  const data = await getService(organizationId);
  return <Component data={data} />;
}

// Client Component Pattern  
export default function Component() {
  const { claims } = useCustomClaims();
  const handleAction = async () => {
    if (!claims?.organizationId) return;
    await serverAction(userEmail, claims.organizationId, data);
  };
}
```

---

## 📊 PROJECT STATUS

**Current Phase**: Post-Architecture Migration  
**Code Quality**: Production Ready (0 TypeScript errors)  
**Test Coverage**: Pending implementation  
**Security**: Production ready with custom claims RBAC  
**Performance**: Optimized for multi-tenant architecture  

**Ready for**: Sprint 3 - Functions & Cloud Tasks implementation

---

## 🎯 SUCCESS METRICS

### **Quality Metrics**
- ✅ TypeScript Compilation: 0 errors
- ✅ Build Success Rate: 100%
- ✅ Security Rules: Multi-tenant compliant
- ✅ Architecture: Consistent patterns throughout

### **Development Velocity**
- Multi-tenant migration: Completed successfully
- TypeScript crisis resolution: 38 errors → 0 errors
- Code quality gates: Implemented and documented
- Prevention strategy: Documented and actionable

---

**Last Verified**: September 3, 2025  
**Project Health**: ✅ EXCELLENT - Ready for continued development