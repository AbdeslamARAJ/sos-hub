import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

function cuid() {
  return "c" + randomBytes(12).toString("hex");
}

const db = new Database("dev.db");

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const now = new Date().toISOString();

  const adminId = cuid();
  db.prepare(`INSERT OR IGNORE INTO User (id, name, email, hashedPassword, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(adminId, "Admin User", "admin@soshub.com", hashedPassword, "ADMIN", now, now);

  const s1Id = cuid(), s2Id = cuid(), s3Id = cuid();
  const insertSupplier = db.prepare(`INSERT INTO Supplier (id, name, contact, email, phone, address, country, certified, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  insertSupplier.run(s1Id, "Fresh Farms Co.", "John Smith", "john@freshfarms.com", "+1-555-0101", "123 Farm Road, Davis, CA", "USA", 1, now, now);
  insertSupplier.run(s2Id, "Atlantic Seafood Ltd.", "Maria Santos", "maria@atlanticseafood.com", "+351-555-0202", null, "Portugal", 1, now, now);
  insertSupplier.run(s3Id, "Green Valley Organics", "Pierre Dubois", "pierre@greenvalley.fr", "+33-555-0303", null, "France", 0, now, now);

  const p1Id = cuid(), p2Id = cuid(), p3Id = cuid(), p4Id = cuid();
  const insertProduct = db.prepare(`INSERT INTO Product (id, name, sku, category, description, unit, supplierId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  insertProduct.run(p1Id, "Organic Tomatoes", "PROD-TOM-001", "Vegetables", "Fresh organic tomatoes", "kg", s1Id, now, now);
  insertProduct.run(p2Id, "Atlantic Salmon", "PROD-SAL-001", "Seafood", "Wild-caught Atlantic salmon", "kg", s2Id, now, now);
  insertProduct.run(p3Id, "Organic Olive Oil", "PROD-OIL-001", "Oils", "Extra virgin olive oil", "L", s3Id, now, now);
  insertProduct.run(p4Id, "Free Range Eggs", "PROD-EGG-001", "Dairy & Eggs", null, "unit", s1Id, now, now);

  const l1Id = cuid(), l2Id = cuid(), l3Id = cuid(), l4Id = cuid();
  const insertLot = db.prepare(`INSERT INTO Lot (id, lotNumber, productId, supplierId, quantity, unit, status, origin, receivedAt, expiresAt, temperature, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  insertLot.run(l1Id, "LOT-2026-001", p1Id, s1Id, 500, "kg", "RECEIVED", "Davis, California", now, "2026-04-15T00:00:00.000Z", 4.2, "Premium grade organic tomatoes", now, now);
  insertLot.run(l2Id, "LOT-2026-002", p2Id, s2Id, 200, "kg", "IN_PROCESS", "Lisbon, Portugal", now, "2026-03-25T00:00:00.000Z", -2.5, null, now, now);
  insertLot.run(l3Id, "LOT-2026-003", p3Id, s3Id, 100, "L", "DISPATCHED", "Provence, France", now, "2027-06-01T00:00:00.000Z", null, null, now, now);
  insertLot.run(l4Id, "LOT-2026-004", p4Id, s1Id, 2000, "unit", "RECEIVED", "Davis, California", now, "2026-04-05T00:00:00.000Z", 3.8, null, now, now);

  const insertEvent = db.prepare(`INSERT INTO TraceEvent (id, lotId, eventType, location, description, temperature, performedBy, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  const events = [
    [l1Id, "RECEIVED", "Warehouse A", "Lot received at main warehouse", 4.2, "Admin User"],
    [l1Id, "INSPECTED", "QC Lab", "Quality inspection passed", 4.0, "QC Team"],
    [l1Id, "STORED", "Cold Storage B", "Moved to cold storage", 3.5, null],
    [l2Id, "RECEIVED", "Port Warehouse", "Shipment received from Portugal", -2.5, "Admin User"],
    [l2Id, "INSPECTED", "QC Lab", "Temperature check and quality inspection", -2.0, "QC Team"],
    [l2Id, "PROCESSED", "Processing Plant", "Processing and packaging started", -1.8, null],
    [l3Id, "RECEIVED", "Warehouse C", "Olive oil shipment received", null, "Admin User"],
    [l3Id, "INSPECTED", "QC Lab", "Acidity and quality checks passed", null, "QC Team"],
    [l3Id, "STORED", "Dry Storage", "Stored in climate-controlled area", null, null],
    [l3Id, "SHIPPED", "Distribution Center", "Dispatched to retail partners", null, "Logistics Team"],
    [l4Id, "RECEIVED", "Warehouse A", "Free range eggs received", 3.8, "Admin User"],
  ];
  for (const [lotId, eventType, location, description, temperature, performedBy] of events) {
    insertEvent.run(cuid(), lotId, eventType, location, description, temperature, performedBy, now);
  }

  const insertAlert = db.prepare(`INSERT INTO Alert (id, title, description, severity, status, type, lotId, createdById, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  insertAlert.run(cuid(), "Temperature deviation detected", "Salmon lot temperature rose above -1°C during processing", "HIGH", "ACTIVE", "TEMPERATURE", l2Id, adminId, now, now);
  insertAlert.run(cuid(), "Approaching expiry date", "Lot LOT-2026-002 expires in 6 days", "MEDIUM", "ACTIVE", "EXPIRY", l2Id, adminId, now, now);
  insertAlert.run(cuid(), "Certification pending", "Green Valley Organics certification renewal pending", "LOW", "ACTIVE", "QUALITY", null, adminId, now, now);

  console.log("Seed data created successfully!");
  console.log("Login: admin@soshub.com / admin123");
}

main().catch(console.error);
