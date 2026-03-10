import { prisma } from "./prisma";

type AuditAction = "CREATE" | "UPDATE" | "DELETE";

interface AuditLogParams {
  userId: string;
  action: AuditAction;
  entity: string;
  entityId?: string | null;
  details?: string | null;
}

/**
 * Audit log kaydı oluşturur. Fire-and-forget — hata fırlatmaz.
 */
export async function logAudit(params: AuditLogParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId ?? null,
        details: params.details ?? null,
      },
    });
  } catch (error) {
    console.error("Audit log error:", error);
  }
}
