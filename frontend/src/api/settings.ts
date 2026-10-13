import type { ChangePasswordPayload } from "@/mocks/settings"

const simulateDelay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export async function changePassword(
  payload: ChangePasswordPayload
): Promise<{ success: boolean; message: string }> {
  await simulateDelay(600)

  if (payload.currentPassword === "wrongpassword") {
    throw new Error("Current password entered is incorrect.")
  }

  if (payload.newPassword !== payload.confirmPassword) {
    throw new Error("New password and confirmation password do not match.")
  }

  return {
    success: true,
    message: "Password changed successfully. Please keep your new credentials secure.",
  }
}
