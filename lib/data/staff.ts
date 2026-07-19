import { media } from "@/lib/data/media"
import type { StaffMember } from "@/types"

export const STAFF: StaffMember[] = [
  { id: "s1", name: "Ayşe Demir", role: "Saç Tasarım Uzmanı", photo: media.team1 },
  { id: "s2", name: "Zeynep Kaya", role: "Renk Uzmanı", photo: media.team2 },
  { id: "s3", name: "Naz Yıldız", role: "Tırnak Bakım Uzmanı", photo: media.team3 },
]
