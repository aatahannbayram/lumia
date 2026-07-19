"use client"

import dynamic from "next/dynamic"
import { createContext, startTransition, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import type { AdminStaffMember } from "@/lib/admin-staff-store"
import type { AdminService } from "@/lib/admin-catalog-store"
import type { AdminNotification } from "@/lib/admin-notifications"

const NewAppointmentModal = dynamic(
  () =>
    import("@/components/admin/new-appointment-modal").then((m) => m.NewAppointmentModal),
  { ssr: false }
)

interface AdminShellContextValue {
  openNewAppointment: (date?: string, time?: string) => void
  pendingCount: number
  notifications: AdminNotification[]
  staffMembers: AdminStaffMember[]
  catalogServices: AdminService[]
  sidebarCollapsed: boolean
  toggleSidebar: () => void
}

const AdminShellContext = createContext<AdminShellContextValue>({
  openNewAppointment: () => {},
  pendingCount: 0,
  notifications: [],
  staffMembers: [],
  catalogServices: [],
  sidebarCollapsed: false,
  toggleSidebar: () => {},
})

export function useAdminShell() {
  return useContext(AdminShellContext)
}

interface AdminShellProps {
  children: React.ReactNode
  pendingCount: number
  notifications: AdminNotification[]
  staffMembers: AdminStaffMember[]
  catalogServices: AdminService[]
  serviceNames: Record<string, string>
}

export function AdminShell({
  children,
  pendingCount,
  notifications,
  staffMembers,
  catalogServices,
  serviceNames,
}: AdminShellProps) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [defaultDate, setDefaultDate] = useState<string>()
  const [defaultTime, setDefaultTime] = useState<string>()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("lumia-admin-sidebar-collapsed")
    if (stored === "true") setSidebarCollapsed(true)
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev
      localStorage.setItem("lumia-admin-sidebar-collapsed", String(next))
      return next
    })
  }, [])

  const openNewAppointment = useCallback((date?: string, time?: string) => {
    setDefaultDate(date)
    setDefaultTime(time)
    setModalOpen(true)
  }, [])

  const activeStaff = useMemo(
    () => staffMembers.filter((s) => s.active),
    [staffMembers]
  )

  const contextValue = useMemo(
    () => ({
      openNewAppointment,
      pendingCount,
      notifications,
      staffMembers,
      catalogServices,
      sidebarCollapsed,
      toggleSidebar,
    }),
    [
      openNewAppointment,
      pendingCount,
      notifications,
      staffMembers,
      catalogServices,
      sidebarCollapsed,
      toggleSidebar,
    ]
  )

  return (
    <AdminShellContext.Provider value={contextValue}>
      <div className="flex min-h-screen w-full bg-muted/30">
        <AdminSidebar />
        <div className="flex min-h-screen w-full min-w-0 flex-1 flex-col overflow-x-hidden">
          {children}
        </div>
      </div>

      {modalOpen && (
        <NewAppointmentModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          defaultDate={defaultDate}
          defaultTime={defaultTime}
          serviceNames={serviceNames}
          staffMembers={activeStaff}
          catalogServices={catalogServices}
          onCreated={() => {
            startTransition(() => router.refresh())
          }}
        />
      )}
    </AdminShellContext.Provider>
  )
}

export function AdminPageHeader(props: Omit<React.ComponentProps<typeof AdminHeader>, "onNewAppointment" | "pendingCount" | "notifications">) {
  const { openNewAppointment, pendingCount, notifications } = useAdminShell()
  return (
    <AdminHeader
      {...props}
      pendingCount={pendingCount}
      notifications={notifications}
      onNewAppointment={openNewAppointment}
    />
  )
}
