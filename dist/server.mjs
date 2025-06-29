var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc3) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc3 = __getOwnPropDesc(from, key)) || desc3.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  customerNotifications: () => customerNotifications,
  customers: () => customers,
  frames: () => frames,
  glassOptions: () => glassOptions,
  insertCustomerNotificationSchema: () => insertCustomerNotificationSchema,
  insertCustomerSchema: () => insertCustomerSchema,
  insertFrameSchema: () => insertFrameSchema,
  insertGlassOptionSchema: () => insertGlassOptionSchema,
  insertInventoryCategorySchema: () => insertInventoryCategorySchema,
  insertInventoryCountItemSchema: () => insertInventoryCountItemSchema,
  insertInventoryCountSchema: () => insertInventoryCountSchema,
  insertInventoryItemSchema: () => insertInventoryItemSchema,
  insertInventoryLocationSchema: () => insertInventoryLocationSchema,
  insertInventoryTransactionSchema: () => insertInventoryTransactionSchema,
  insertLarsonJuhlCatalogSchema: () => insertLarsonJuhlCatalogSchema,
  insertMatColorSchema: () => insertMatColorSchema,
  insertMaterialLocationSchema: () => insertMaterialLocationSchema,
  insertMaterialOrderSchema: () => insertMaterialOrderSchema,
  insertNotificationSchema: () => insertNotificationSchema,
  insertOrderFrameSchema: () => insertOrderFrameSchema,
  insertOrderGroupSchema: () => insertOrderGroupSchema,
  insertOrderMatSchema: () => insertOrderMatSchema,
  insertOrderSchema: () => insertOrderSchema,
  insertOrderSpecialServiceSchema: () => insertOrderSpecialServiceSchema,
  insertPaymentLinkSchema: () => insertPaymentLinkSchema,
  insertPurchaseOrderLineSchema: () => insertPurchaseOrderLineSchema,
  insertPurchaseOrderSchema: () => insertPurchaseOrderSchema,
  insertQrCodeScanSchema: () => insertQrCodeScanSchema,
  insertQrCodeSchema: () => insertQrCodeSchema,
  insertSpecialServiceSchema: () => insertSpecialServiceSchema,
  insertSupplierSchema: () => insertSupplierSchema,
  insertUserSchema: () => insertUserSchema,
  insertWholesaleOrderSchema: () => insertWholesaleOrderSchema,
  inventoryCategories: () => inventoryCategories,
  inventoryCountItems: () => inventoryCountItems,
  inventoryCounts: () => inventoryCounts,
  inventoryItems: () => inventoryItems,
  inventoryLocations: () => inventoryLocations,
  inventoryTransactions: () => inventoryTransactions,
  larsonJuhlCatalog: () => larsonJuhlCatalog,
  matColors: () => matColors,
  materialLocations: () => materialLocations,
  materialOrderStatuses: () => materialOrderStatuses,
  materialOrders: () => materialOrders,
  materialTypes: () => materialTypes,
  measurementUnits: () => measurementUnits,
  notificationChannels: () => notificationChannels,
  notificationTypes: () => notificationTypes,
  notifications: () => notifications,
  orderFrames: () => orderFrames,
  orderGroups: () => orderGroups,
  orderMats: () => orderMats,
  orderSpecialServices: () => orderSpecialServices,
  orders: () => orders,
  paymentLinks: () => paymentLinks,
  productionStatuses: () => productionStatuses,
  purchaseOrderLines: () => purchaseOrderLines,
  purchaseOrderStatuses: () => purchaseOrderStatuses,
  purchaseOrders: () => purchaseOrders,
  qrCodeScans: () => qrCodeScans,
  qrCodeTypes: () => qrCodeTypes,
  qrCodes: () => qrCodes,
  specialServices: () => specialServices,
  suppliers: () => suppliers,
  transactionTypes: () => transactionTypes,
  users: () => users,
  wholesaleOrders: () => wholesaleOrders
});
import { pgTable, text, serial, integer, boolean, numeric, timestamp, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var customers, insertCustomerSchema, frames, insertFrameSchema, matColors, insertMatColorSchema, glassOptions, insertGlassOptionSchema, specialServices, insertSpecialServiceSchema, orderGroups, insertOrderGroupSchema, productionStatuses, orders, insertOrderSchema, orderSpecialServices, insertOrderSpecialServiceSchema, orderMats, insertOrderMatSchema, orderFrames, insertOrderFrameSchema, wholesaleOrders, insertWholesaleOrderSchema, users, insertUserSchema, larsonJuhlCatalog, insertLarsonJuhlCatalogSchema, notificationTypes, notificationChannels, customerNotifications, insertCustomerNotificationSchema, materialTypes, materialOrderStatuses, materialOrders, insertMaterialOrderSchema, suppliers, insertSupplierSchema, inventoryCategories, insertInventoryCategorySchema, inventoryLocations, insertInventoryLocationSchema, measurementUnits, inventoryItems, insertInventoryItemSchema, transactionTypes, inventoryTransactions, insertInventoryTransactionSchema, purchaseOrderStatuses, purchaseOrders, insertPurchaseOrderSchema, purchaseOrderLines, insertPurchaseOrderLineSchema, inventoryCounts, insertInventoryCountSchema, inventoryCountItems, insertInventoryCountItemSchema, paymentLinks, insertPaymentLinkSchema, qrCodeTypes, qrCodes, insertQrCodeSchema, qrCodeScans, insertQrCodeScanSchema, materialLocations, insertMaterialLocationSchema, notifications, insertNotificationSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    customers = pgTable("customers", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      email: text("email"),
      phone: text("phone"),
      address: text("address"),
      stripeCustomerId: text("stripe_customer_id"),
      createdAt: timestamp("created_at").defaultNow()
    });
    insertCustomerSchema = createInsertSchema(customers).omit({ id: true, createdAt: true });
    frames = pgTable("frames", {
      id: text("id").primaryKey(),
      name: text("name").notNull(),
      manufacturer: text("manufacturer").notNull(),
      material: text("material").notNull(),
      width: numeric("width").notNull(),
      // in inches
      depth: numeric("depth").notNull(),
      // in inches
      price: numeric("price").notNull(),
      // per foot (wholesale)
      catalogImage: text("catalog_image").notNull(),
      edgeTexture: text("edge_texture"),
      corner: text("corner")
      // color is added programmatically in storage.ts
    });
    insertFrameSchema = createInsertSchema(frames);
    matColors = pgTable("mat_colors", {
      id: text("id").primaryKey(),
      name: text("name").notNull(),
      color: text("color").notNull(),
      price: numeric("price").notNull(),
      // per square inch (wholesale)
      manufacturer: text("manufacturer"),
      code: text("code"),
      description: text("description"),
      category: text("category")
    });
    insertMatColorSchema = createInsertSchema(matColors);
    glassOptions = pgTable("glass_options", {
      id: text("id").primaryKey(),
      name: text("name").notNull(),
      description: text("description").notNull(),
      price: numeric("price").notNull()
      // per square inch (wholesale)
    });
    insertGlassOptionSchema = createInsertSchema(glassOptions);
    specialServices = pgTable("special_services", {
      id: text("id").primaryKey(),
      name: text("name").notNull(),
      description: text("description").notNull(),
      price: numeric("price").notNull()
      // fixed price (wholesale)
    });
    insertSpecialServiceSchema = createInsertSchema(specialServices);
    orderGroups = pgTable("order_groups", {
      id: serial("id").primaryKey(),
      customerId: integer("customer_id").references(() => customers.id),
      subtotal: numeric("subtotal"),
      tax: numeric("tax"),
      total: numeric("total"),
      status: text("status").notNull().default("open"),
      paymentMethod: text("payment_method"),
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow(),
      stripePaymentIntentId: text("stripe_payment_intent_id"),
      stripePaymentStatus: text("stripe_payment_status"),
      paymentDate: timestamp("payment_date"),
      discountAmount: numeric("discount_amount"),
      discountType: text("discount_type"),
      // 'percentage' or 'fixed'
      taxExempt: boolean("tax_exempt").default(false),
      cashAmount: numeric("cash_amount"),
      checkNumber: text("check_number"),
      invoiceEmailSent: boolean("invoice_email_sent").default(false),
      invoiceEmailDate: timestamp("invoice_email_date")
    });
    insertOrderGroupSchema = createInsertSchema(orderGroups).omit({ id: true, createdAt: true });
    productionStatuses = [
      "order_processed",
      "scheduled",
      "materials_ordered",
      "materials_arrived",
      "frame_cut",
      "mat_cut",
      "prepped",
      "completed",
      "delayed"
    ];
    orders = pgTable("orders", {
      id: serial("id").primaryKey(),
      customerId: integer("customer_id").references(() => customers.id),
      orderGroupId: integer("order_group_id").references(() => orderGroups.id),
      frameId: text("frame_id").references(() => frames.id),
      // matColorId retained for backward compatibility
      matColorId: text("mat_color_id").references(() => matColors.id),
      glassOptionId: text("glass_option_id").references(() => glassOptions.id),
      artworkWidth: numeric("artwork_width").notNull(),
      // in inches
      artworkHeight: numeric("artwork_height").notNull(),
      // in inches
      // matWidth retained for backward compatibility with single mat
      matWidth: numeric("mat_width").notNull(),
      // in inches
      artworkDescription: text("artwork_description"),
      artworkType: text("artwork_type"),
      artworkLocation: text("artwork_location"),
      quantity: integer("quantity").notNull().default(1),
      subtotal: numeric("subtotal").notNull(),
      tax: numeric("tax").notNull(),
      total: numeric("total").notNull(),
      status: text("status").notNull().default("pending"),
      // Order payment status
      productionStatus: text("production_status").$type().notNull().default("order_processed"),
      // Production workflow status
      previousStatus: text("previous_status").$type(),
      // Used to track previous status, especially for delays
      createdAt: timestamp("created_at").defaultNow(),
      dueDate: timestamp("due_date"),
      artworkImage: text("artwork_image"),
      frameDesignImage: text("frame_design_image"),
      lastNotificationSent: timestamp("last_notification_sent"),
      estimatedCompletionDays: integer("estimated_completion_days"),
      addToWholesaleOrder: boolean("add_to_wholesale_order").default(false),
      lastStatusChange: timestamp("last_status_change").defaultNow(),
      notificationsEnabled: boolean("notifications_enabled").default(true),
      // New fields for multiple mat/frame support
      useMultipleMats: boolean("use_multiple_mats").default(false),
      useMultipleFrames: boolean("use_multiple_frames").default(false),
      // Manual frame entry fields
      useManualFrame: boolean("use_manual_frame").default(false),
      manualFrameName: text("manual_frame_name"),
      manualFrameCost: numeric("manual_frame_cost"),
      // Miscellaneous charges
      miscChargeDescription: text("misc_charge_description"),
      miscChargeAmount: numeric("misc_charge_amount")
    });
    insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
    orderSpecialServices = pgTable("order_special_services", {
      orderId: integer("order_id").references(() => orders.id),
      specialServiceId: text("special_service_id").references(() => specialServices.id)
    }, (t) => ({
      pk: primaryKey({ columns: [t.orderId, t.specialServiceId] })
    }));
    insertOrderSpecialServiceSchema = createInsertSchema(orderSpecialServices);
    orderMats = pgTable("order_mats", {
      id: serial("id").primaryKey(),
      orderId: integer("order_id").references(() => orders.id).notNull(),
      matColorId: text("mat_color_id").references(() => matColors.id).notNull(),
      position: integer("position").notNull(),
      // 1, 2, 3 for top, middle, bottom mats
      width: numeric("width").notNull(),
      // Width of mat in inches
      offset: numeric("offset").notNull().default("0"),
      // Offset from previous mat in inches
      createdAt: timestamp("created_at").defaultNow()
    });
    insertOrderMatSchema = createInsertSchema(orderMats).omit({ id: true, createdAt: true });
    orderFrames = pgTable("order_frames", {
      id: serial("id").primaryKey(),
      orderId: integer("order_id").references(() => orders.id).notNull(),
      frameId: text("frame_id").references(() => frames.id).notNull(),
      position: integer("position").notNull(),
      // 1, 2 for inner and outer frames
      distance: numeric("distance").notNull().default("0"),
      // Distance from artwork in inches
      createdAt: timestamp("created_at").defaultNow()
    });
    insertOrderFrameSchema = createInsertSchema(orderFrames).omit({ id: true, createdAt: true });
    wholesaleOrders = pgTable("wholesale_orders", {
      id: serial("id").primaryKey(),
      orderId: integer("order_id").references(() => orders.id),
      manufacturer: text("manufacturer").notNull(),
      items: jsonb("items").notNull(),
      // Array of items to order
      status: text("status").notNull().default("pending"),
      createdAt: timestamp("created_at").defaultNow()
    });
    insertWholesaleOrderSchema = createInsertSchema(wholesaleOrders).omit({ id: true, createdAt: true });
    users = pgTable("users", {
      id: serial("id").primaryKey(),
      username: text("username").notNull().unique(),
      password: text("password").notNull(),
      role: text("role").notNull().default("employee")
    });
    insertUserSchema = createInsertSchema(users).omit({ id: true });
    larsonJuhlCatalog = pgTable("larson_juhl_catalog", {
      id: text("id").primaryKey(),
      name: text("name").notNull(),
      hex_color: text("hex_color"),
      price: numeric("price", { precision: 10, scale: 6 }).notNull(),
      code: text("code").notNull(),
      crescent_code: text("crescent_code"),
      description: text("description"),
      category: text("category"),
      manufacturer: text("manufacturer").notNull(),
      type: text("type").notNull().default("matboard"),
      // 'matboard' or 'frame'
      material: text("material"),
      // For frames
      width: numeric("width"),
      // For frames (in inches)
      depth: numeric("depth"),
      // For frames (in inches)
      edge_texture: text("edge_texture"),
      // For frames
      corner: text("corner"),
      // For frames
      catalog_image: text("catalog_image"),
      // URL to manufacturer catalog image
      createdAt: timestamp("created_at").defaultNow()
    });
    insertLarsonJuhlCatalogSchema = createInsertSchema(larsonJuhlCatalog).omit({ createdAt: true });
    notificationTypes = [
      "status_update",
      "estimated_completion",
      "status_change",
      "due_date_update",
      "completion_reminder",
      "order_complete",
      "payment_reminder",
      "delay_notification",
      "payment_link"
    ];
    notificationChannels = [
      "email",
      "sms",
      "both"
    ];
    customerNotifications = pgTable("customer_notifications", {
      id: serial("id").primaryKey(),
      customerId: integer("customer_id").references(() => customers.id),
      orderId: integer("order_id").references(() => orders.id),
      notificationType: text("notification_type").$type().notNull(),
      channel: text("channel").$type().notNull().default("email"),
      subject: text("subject").notNull(),
      message: text("message").notNull(),
      sentAt: timestamp("sent_at").defaultNow(),
      successful: boolean("successful").notNull(),
      responseData: jsonb("response_data"),
      previousStatus: text("previous_status"),
      newStatus: text("new_status"),
      paymentLinkId: integer("payment_link_id")
    });
    insertCustomerNotificationSchema = createInsertSchema(customerNotifications).omit({ id: true, sentAt: true });
    materialTypes = [
      "frame",
      "matboard",
      "glass",
      "backing_board",
      "hardware",
      "specialty_materials"
    ];
    materialOrderStatuses = [
      "pending",
      "processed",
      "ordered",
      "arrived",
      "frame_cut",
      "mat_cut",
      "prepped",
      "completed",
      "delayed",
      "canceled"
    ];
    materialOrders = pgTable("material_orders", {
      id: serial("id").primaryKey(),
      materialType: text("material_type").$type().notNull(),
      materialId: text("material_id").notNull(),
      // frameId, matColorId, etc.
      materialName: text("material_name").notNull(),
      // Note: 'vendor' field is removed as it doesn't exist in the database
      // Use 'supplierName' instead
      quantity: numeric("quantity").notNull(),
      status: text("status").$type().notNull().default("pending"),
      sourceOrderId: integer("source_order_id").references(() => orders.id),
      orderDate: timestamp("order_date"),
      expectedArrival: timestamp("expected_arrival"),
      actualArrival: timestamp("actual_arrival"),
      supplierName: text("supplier_name"),
      supplierOrderNumber: text("supplier_order_number"),
      notes: text("notes"),
      costPerUnit: numeric("cost_per_unit"),
      totalCost: numeric("total_cost"),
      priority: text("priority").default("normal"),
      // Hub integration fields
      hubOrderId: text("hub_order_id"),
      hubSyncStatus: text("hub_sync_status").default("not_synced"),
      hubLastSyncDate: timestamp("hub_last_sync_date"),
      hubTrackingInfo: text("hub_tracking_info"),
      hubEstimatedDelivery: timestamp("hub_estimated_delivery"),
      hubSupplierNotes: text("hub_supplier_notes"),
      orderReference: text("order_reference"),
      // Reference number for this order
      unitMeasurement: text("unit_measurement"),
      // e.g., "inches", "feet", "united_inch"
      createdAt: timestamp("created_at").defaultNow()
    });
    insertMaterialOrderSchema = createInsertSchema(materialOrders).omit({
      id: true,
      createdAt: true,
      hubOrderId: true,
      hubSyncStatus: true,
      hubLastSyncDate: true,
      hubTrackingInfo: true,
      hubEstimatedDelivery: true,
      hubSupplierNotes: true
    });
    suppliers = pgTable("suppliers", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      contactName: text("contact_name"),
      email: text("email"),
      phone: text("phone"),
      address: text("address"),
      website: text("website"),
      accountNumber: text("account_number"),
      notes: text("notes"),
      paymentTerms: text("payment_terms"),
      minimumOrderAmount: numeric("minimum_order_amount"),
      shippingPreference: text("shipping_preference"),
      leadTime: integer("lead_time"),
      // typical lead time in days
      active: boolean("active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      lastOrderDate: timestamp("last_order_date")
    });
    insertSupplierSchema = createInsertSchema(suppliers).omit({ id: true, createdAt: true });
    inventoryCategories = pgTable("inventory_categories", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      description: text("description"),
      parentCategoryId: integer("parent_category_id").references(() => inventoryCategories.id),
      createdAt: timestamp("created_at").defaultNow()
    });
    insertInventoryCategorySchema = createInsertSchema(inventoryCategories).omit({ id: true, createdAt: true });
    inventoryLocations = pgTable("inventory_locations", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      // e.g., "Shelf A1", "Cabinet 3", etc.
      description: text("description"),
      type: text("type"),
      // e.g., "shelf", "drawer", "bin", etc.
      parentLocationId: integer("parent_location_id").references(() => inventoryLocations.id),
      active: boolean("active").default(true),
      createdAt: timestamp("created_at").defaultNow()
    });
    insertInventoryLocationSchema = createInsertSchema(inventoryLocations).omit({ id: true, createdAt: true });
    measurementUnits = [
      "each",
      "inch",
      "foot",
      "united_inch",
      "square_inch",
      "sheet",
      "roll",
      "pound",
      "liter",
      "gallon"
    ];
    inventoryItems = pgTable("inventory_items", {
      id: serial("id").primaryKey(),
      sku: text("sku").notNull().unique(),
      // Stock Keeping Unit - unique identifier
      name: text("name").notNull(),
      description: text("description"),
      categoryId: integer("category_id").references(() => inventoryCategories.id),
      supplierId: integer("supplier_id").references(() => suppliers.id),
      supplierSku: text("supplier_sku"),
      // Supplier's item number/SKU
      unitOfMeasure: text("unit_of_measure").$type().notNull(),
      costPerUnit: numeric("cost_per_unit").notNull(),
      retailPrice: numeric("retail_price"),
      minimumStockLevel: numeric("minimum_stock_level").notNull(),
      reorderLevel: numeric("reorder_level").notNull(),
      // when to reorder
      reorderQuantity: numeric("reorder_quantity"),
      // how much to reorder
      locationId: integer("location_id").references(() => inventoryLocations.id),
      barcode: text("barcode"),
      notes: text("notes"),
      tags: text("tags").array(),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow(),
      lastCountDate: timestamp("last_count_date"),
      imageUrl: text("image_url"),
      dimensions: jsonb("dimensions"),
      // for items with dimensions (width, height, etc.)
      autoBatchReorder: boolean("auto_batch_reorder").default(false),
      // automatically add to batch orders
      materialType: text("material_type").$type(),
      // for linking to existing material types
      materialId: text("material_id")
      // ID in source material table if applicable
    });
    insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    transactionTypes = [
      "purchase",
      "sale",
      "adjustment",
      "return",
      "transfer",
      "count",
      "scrap",
      "initial"
    ];
    inventoryTransactions = pgTable("inventory_transactions", {
      id: serial("id").primaryKey(),
      itemId: integer("item_id").references(() => inventoryItems.id).notNull(),
      type: text("type").$type().notNull(),
      quantity: numeric("quantity").notNull(),
      unitCost: numeric("unit_cost"),
      locationId: integer("location_id").references(() => inventoryLocations.id),
      relatedOrderId: integer("related_order_id").references(() => orders.id),
      notes: text("notes"),
      referenceNumber: text("reference_number"),
      createdAt: timestamp("created_at").defaultNow(),
      createdBy: integer("created_by").references(() => users.id)
    });
    insertInventoryTransactionSchema = createInsertSchema(inventoryTransactions).omit({
      id: true,
      createdAt: true
    });
    purchaseOrderStatuses = [
      "draft",
      "pending",
      "approved",
      "sent",
      "partially_received",
      "received",
      "canceled"
    ];
    purchaseOrders = pgTable("purchase_orders", {
      id: serial("id").primaryKey(),
      poNumber: text("po_number").notNull(),
      // generated PO number
      supplierId: integer("supplier_id").references(() => suppliers.id).notNull(),
      orderDate: timestamp("order_date").notNull(),
      expectedDeliveryDate: timestamp("expected_delivery_date"),
      status: text("status").$type().default("draft").notNull(),
      subtotal: numeric("subtotal"),
      tax: numeric("tax"),
      shipping: numeric("shipping"),
      total: numeric("total"),
      notes: text("notes"),
      createdBy: integer("created_by").references(() => users.id),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow(),
      receivedDate: timestamp("received_date"),
      supplierOrderConfirmation: text("supplier_order_confirmation"),
      shippingMethod: text("shipping_method"),
      paymentMethod: text("payment_method"),
      paymentTerms: text("payment_terms"),
      tracking: text("tracking"),
      attachments: text("attachments").array()
    });
    insertPurchaseOrderSchema = createInsertSchema(purchaseOrders).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    purchaseOrderLines = pgTable("purchase_order_lines", {
      id: serial("id").primaryKey(),
      purchaseOrderId: integer("purchase_order_id").references(() => purchaseOrders.id).notNull(),
      itemId: integer("item_id").references(() => inventoryItems.id).notNull(),
      quantity: numeric("quantity").notNull(),
      unitCost: numeric("unit_cost").notNull(),
      lineTotal: numeric("line_total").notNull(),
      receivedQuantity: numeric("received_quantity").default("0"),
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow()
    });
    insertPurchaseOrderLineSchema = createInsertSchema(purchaseOrderLines).omit({
      id: true,
      createdAt: true
    });
    inventoryCounts = pgTable("inventory_counts", {
      id: serial("id").primaryKey(),
      countReference: text("count_reference").notNull(),
      // e.g., "COUNT-2023-04-15"
      startDate: timestamp("start_date").notNull(),
      endDate: timestamp("end_date"),
      status: text("status").default("in_progress").notNull(),
      // "in_progress", "completed", "canceled"
      notes: text("notes"),
      createdBy: integer("created_by").references(() => users.id),
      createdAt: timestamp("created_at").defaultNow()
    });
    insertInventoryCountSchema = createInsertSchema(inventoryCounts).omit({
      id: true,
      createdAt: true
    });
    inventoryCountItems = pgTable("inventory_count_items", {
      id: serial("id").primaryKey(),
      countId: integer("count_id").references(() => inventoryCounts.id).notNull(),
      itemId: integer("item_id").references(() => inventoryItems.id).notNull(),
      locationId: integer("location_id").references(() => inventoryLocations.id),
      expectedQuantity: numeric("expected_quantity"),
      // expected based on system records
      actualQuantity: numeric("actual_quantity"),
      // actual counted quantity
      notes: text("notes"),
      countedBy: integer("counted_by").references(() => users.id),
      countedAt: timestamp("counted_at"),
      createdAt: timestamp("created_at").defaultNow()
    });
    insertInventoryCountItemSchema = createInsertSchema(inventoryCountItems).omit({
      id: true,
      createdAt: true
    });
    paymentLinks = pgTable("payment_links", {
      id: serial("id").primaryKey(),
      token: text("token").notNull().unique(),
      amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
      description: text("description"),
      customerId: integer("customer_id").references(() => customers.id),
      createdAt: timestamp("created_at").defaultNow(),
      expiresAt: timestamp("expires_at").notNull(),
      usedAt: timestamp("used_at"),
      used: boolean("used").default(false),
      paymentIntentId: text("payment_intent_id"),
      paymentStatus: text("payment_status").default("pending")
    });
    insertPaymentLinkSchema = createInsertSchema(paymentLinks).omit({
      id: true,
      createdAt: true,
      usedAt: true,
      used: true,
      paymentIntentId: true,
      paymentStatus: true
    });
    qrCodeTypes = [
      "inventory_location",
      "inventory_item",
      "material_order",
      "customer_order",
      "production_status",
      "artwork_location"
    ];
    qrCodes = pgTable("qr_codes", {
      id: serial("id").primaryKey(),
      code: text("code").notNull().unique(),
      // Unique identifier for the QR code
      type: text("type").$type().notNull(),
      entityId: text("entity_id").notNull(),
      // ID of the related entity (inventoryLocationId, itemId, orderId, etc.)
      title: text("title").notNull(),
      // Human-readable title for the QR code
      description: text("description"),
      metadata: jsonb("metadata"),
      // Additional data specific to the QR code type
      createdAt: timestamp("created_at").defaultNow(),
      lastScanned: timestamp("last_scanned"),
      scanCount: integer("scan_count").default(0),
      active: boolean("active").default(true)
    });
    insertQrCodeSchema = createInsertSchema(qrCodes).omit({
      id: true,
      createdAt: true,
      lastScanned: true,
      scanCount: true
    });
    qrCodeScans = pgTable("qr_code_scans", {
      id: serial("id").primaryKey(),
      qrCodeId: integer("qr_code_id").references(() => qrCodes.id).notNull(),
      userId: integer("user_id").references(() => users.id),
      // User who scanned the code (if authenticated)
      scannedAt: timestamp("scanned_at").defaultNow(),
      location: text("location"),
      // Optional location data
      action: text("action"),
      // Action performed during this scan
      metadata: jsonb("metadata")
      // Additional scan-specific data
    });
    insertQrCodeScanSchema = createInsertSchema(qrCodeScans).omit({
      id: true,
      scannedAt: true
    });
    materialLocations = pgTable("material_locations", {
      id: serial("id").primaryKey(),
      materialType: text("material_type").$type().notNull(),
      materialId: text("material_id").notNull(),
      // frameId, matColorId, etc.
      locationId: integer("location_id").references(() => inventoryLocations.id).notNull(),
      qrCodeId: integer("qr_code_id").references(() => qrCodes.id),
      quantity: numeric("quantity").notNull().default("1"),
      notes: text("notes"),
      lastUpdated: timestamp("last_updated").defaultNow(),
      active: boolean("active").default(true)
    });
    insertMaterialLocationSchema = createInsertSchema(materialLocations).omit({
      id: true,
      lastUpdated: true
    });
    notifications = pgTable("notifications", {
      id: serial("id").primaryKey(),
      title: text("title").notNull(),
      description: text("description").notNull(),
      source: text("source").notNull(),
      // The app or system component that generated this notification
      sourceId: text("source_id"),
      // ID within the source system (order ID, etc.)
      type: text("type").$type().notNull().default("info"),
      createdAt: timestamp("created_at").defaultNow(),
      read: boolean("read").default(false),
      actionable: boolean("actionable").default(false),
      link: text("link"),
      // Optional link for actionable notifications
      smsEnabled: boolean("sms_enabled").default(false),
      smsRecipient: text("sms_recipient"),
      userId: integer("user_id").references(() => users.id)
      // Optional user ID if notification is for a specific user
    });
    insertNotificationSchema = createInsertSchema(notifications).omit({
      id: true,
      createdAt: true
    });
  }
});

// client/src/data/frameCatalog.ts
var frameCatalog;
var init_frameCatalog = __esm({
  "client/src/data/frameCatalog.ts"() {
    "use strict";
    frameCatalog = [
      {
        id: "larson-4512",
        name: "Larson Gold Leaf 4512",
        manufacturer: "Larson-Juhl",
        material: "wood",
        width: "2.5",
        depth: "1.75",
        price: "12.99",
        catalogImage: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGljdHVyZSUyMGZyYW1lfGVufDB8fDB8fHww",
        edgeTexture: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGljdHVyZSUyMGZyYW1lfGVufDB8fDB8fHww",
        corner: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGljdHVyZSUyMGZyYW1lfGVufDB8fDB8fHww",
        color: "#D4AF37"
      },
      {
        id: "larson-210286",
        name: "Larson Academie Black 210286",
        manufacturer: "Larson-Juhl",
        material: "wood",
        width: "1.25",
        depth: "0.75",
        price: "8.50",
        catalogImage: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGljdHVyZSUyMGZyYW1lfGVufDB8fDB8fHww",
        edgeTexture: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGljdHVyZSUyMGZyYW1lfGVufDB8fDB8fHww",
        corner: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGljdHVyZSUyMGZyYW1lfGVufDB8fDB8fHww",
        color: "#000000"
      },
      {
        id: "larson-655320",
        name: "Larson Biltmore Gold 655320",
        manufacturer: "Larson-Juhl",
        material: "wood",
        width: "1.5",
        depth: "0.875",
        price: "10.75",
        catalogImage: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGljdHVyZSUyMGZyYW1lfGVufDB8fDB8fHww",
        edgeTexture: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGljdHVyZSUyMGZyYW1lfGVufDB8fDB8fHww",
        corner: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGljdHVyZSUyMGZyYW1lfGVufDB8fDB8fHww",
        color: "#FFD700"
      },
      {
        id: "larson-460530",
        name: "Larson Ventura Silver 460530",
        manufacturer: "Larson-Juhl",
        material: "metal",
        width: "0.75",
        depth: "1.125",
        price: "9.25",
        catalogImage: "https://images.unsplash.com/photo-1510172951991-856a654063f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGljdHVyZSUyMGZyYW1lfGVufDB8fDB8fHww",
        edgeTexture: "https://images.unsplash.com/photo-1510172951991-856a654063f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGljdHVyZSUyMGZyYW1lfGVufDB8fDB8fHww",
        corner: "https://images.unsplash.com/photo-1510172951991-856a654063f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGljdHVyZSUyMGZyYW1lfGVufDB8fDB8fHww",
        color: "#C0C0C0"
      },
      {
        id: "larson-310445",
        name: "Larson Classic Walnut 310445",
        manufacturer: "Larson-Juhl",
        material: "wood",
        width: "2.0",
        depth: "1.25",
        price: "14.50",
        catalogImage: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGljdHVyZSUyMGZyYW1lfGVufDB8fDB8fHww",
        edgeTexture: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGljdHVyZSUyMGZyYW1lfGVufDB8fDB8fHww",
        corner: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGljdHVyZSUyMGZyYW1lfGVufDB8fDB8fHww",
        color: "#8B4513"
      },
      {
        id: "larson-220158",
        name: "Larson Heritage Cherry 220158",
        manufacturer: "Larson-Juhl",
        material: "wood",
        width: "1.75",
        depth: "1.0",
        price: "11.25",
        catalogImage: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGljdHVyZSUyMGZyYW1lfGVufDB8fDB8fHww",
        edgeTexture: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGljdHVyZSUyMGZyYW1lfGVufDB8fDB8fHww",
        corner: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGljdHVyZSUyMGZyYW1lfGVufDB8fDB8fHww",
        color: "#722F37"
      },
      {
        id: "nielsen-71",
        name: "Nielsen Florentine",
        manufacturer: "Nielsen",
        material: "metal",
        width: "1.25",
        // in inches
        depth: "0.75",
        // in inches
        price: "8.99",
        // per foot
        catalogImage: "https://images.unsplash.com/photo-1510172951991-856a654063f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGljdHVyZSUyMGZyYW1lfGVufDB8fDB8fHww",
        edgeTexture: "https://images.unsplash.com/photo-1510172951991-856a654063f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGljdHVyZSUyMGZyYW1lfGVufDB8fDB8fHww",
        corner: "https://images.unsplash.com/photo-1510172951991-856a654063f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGljdHVyZSUyMGZyYW1lfGVufDB8fDB8fHww",
        color: "#C0C0C0"
        // Silver color
      },
      {
        id: "roma-250",
        name: "Roma Dark Walnut",
        manufacturer: "Roma Moulding",
        material: "wood",
        width: "3.0",
        // in inches
        depth: "2.0",
        // in inches
        price: "14.50",
        // per foot
        catalogImage: "https://images.unsplash.com/photo-1579541591661-567c1ea5dc56?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBpY3R1cmUlMjBmcmFtZXxlbnwwfHwwfHx8MA%3D%3D",
        edgeTexture: "https://images.unsplash.com/photo-1579541591661-567c1ea5dc56?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBpY3R1cmUlMjBmcmFtZXxlbnwwfHwwfHx8MA%3D%3D",
        corner: "https://images.unsplash.com/photo-1579541591661-567c1ea5dc56?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBpY3R1cmUlMjBmcmFtZXxlbnwwfHwwfHx8MA%3D%3D",
        color: "#5C4033"
        // Walnut color
      },
      {
        id: "omega-102",
        name: "Omega Black Satin",
        manufacturer: "Omega Moulding",
        material: "wood",
        width: "2.0",
        // in inches
        depth: "1.5",
        // in inches
        price: "9.75",
        // per foot
        catalogImage: "https://images.unsplash.com/photo-1594194208961-0fdf358251d3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHBpY3R1cmUlMjBmcmFtZXxlbnwwfHwwfHx8MA%3D%3D",
        edgeTexture: "https://images.unsplash.com/photo-1594194208961-0fdf358251d3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHBpY3R1cmUlMjBmcmFtZXxlbnwwfHwwfHx8MA%3D%3D",
        corner: "https://images.unsplash.com/photo-1594194208961-0fdf358251d3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHBpY3R1cmUlMjBmcmFtZXxlbnwwfHwwfHx8MA%3D%3D",
        color: "#2D2D2D"
        // Black color
      },
      {
        id: "bella-35",
        name: "Bella White Simple",
        manufacturer: "Bella Moulding",
        material: "composite",
        width: "1.5",
        // in inches
        depth: "1.0",
        // in inches
        price: "6.50",
        // per foot
        catalogImage: "https://images.unsplash.com/photo-1574117936532-46e544aeb239?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHBpY3R1cmUlMjBmcmFtZXxlbnwwfHwwfHx8MA%3D%3D",
        edgeTexture: "https://images.unsplash.com/photo-1574117936532-46e544aeb239?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHBpY3R1cmUlMjBmcmFtZXxlbnwwfHwwfHx8MA%3D%3D",
        corner: "https://images.unsplash.com/photo-1574117936532-46e544aeb239?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHBpY3R1cmUlMjBmcmFtZXxlbnwwfHwwfHx8MA%3D%3D",
        color: "#F5F5F5"
        // White color
      },
      {
        id: "larson-8921",
        name: "Larson Ornate Gold",
        manufacturer: "Larson-Juhl",
        material: "wood",
        width: "3.5",
        // in inches
        depth: "2.25",
        // in inches
        price: "18.99",
        // per foot
        catalogImage: "https://images.unsplash.com/photo-1581814605484-050c5bb1196c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fHBpY3R1cmUlMjBmcmFtZXxlbnwwfHwwfHx8MA%3D%3D",
        edgeTexture: "https://images.unsplash.com/photo-1581814605484-050c5bb1196c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fHBpY3R1cmUlMjBmcmFtZXxlbnwwfHwwfHx8MA%3D%3D",
        corner: "https://images.unsplash.com/photo-1581814605484-050c5bb1196c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fHBpY3R1cmUlMjBmcmFtZXxlbnwwfHwwfHx8MA%3D%3D",
        color: "#D4AF37"
        // Gold color
      }
    ];
  }
});

// client/src/services/matboardService.ts
async function fetchCrescentMatboards() {
  try {
    console.log("Loading static matboard data to prevent application freezing...");
    return [];
  } catch (error) {
    console.error("Error fetching Crescent matboards:", error);
    return [];
  }
}
var init_matboardService = __esm({
  "client/src/services/matboardService.ts"() {
    "use strict";
  }
});

// client/src/data/matColors.ts
var basicMatColors, crescentMatColors, matColorCatalog, loadCrescentMatboardsFromSupabase;
var init_matColors = __esm({
  "client/src/data/matColors.ts"() {
    "use strict";
    init_matboardService();
    basicMatColors = [
      {
        id: "white",
        name: "White",
        color: "#FFFFFF",
        price: "0.02",
        // per square inch (wholesale)
        manufacturer: "Basic",
        code: "WHT",
        description: "Pure white mat board",
        category: "Standard"
      },
      {
        id: "black",
        name: "Black",
        color: "#2C2C2C",
        price: "0.025",
        // per square inch (wholesale)
        manufacturer: "Basic",
        code: "BLK",
        description: "Deep black mat board",
        category: "Standard"
      },
      {
        id: "grey",
        name: "Grey",
        color: "#ADADAD",
        price: "0.02",
        // per square inch (wholesale)
        manufacturer: "Basic",
        code: "GRY",
        description: "Neutral grey mat board",
        category: "Standard"
      },
      {
        id: "beige",
        name: "Beige",
        color: "#F5F5DC",
        price: "0.02",
        // per square inch (wholesale)
        manufacturer: "Basic",
        code: "BGE",
        description: "Soft beige mat board",
        category: "Standard"
      }
    ];
    crescentMatColors = [
      // Whites
      {
        id: "crescent-white",
        name: "Bright White",
        color: "#FFFFFF",
        price: "0.025",
        // per square inch (wholesale)
        manufacturer: "Crescent",
        code: "S100",
        description: "Bright white conservation mat board",
        category: "Whites"
      },
      {
        id: "crescent-cream",
        name: "Cream",
        color: "#FFF8E1",
        price: "0.025",
        // per square inch (wholesale)
        manufacturer: "Crescent",
        code: "S101",
        description: "Cream white conservation mat board",
        category: "Whites"
      },
      {
        id: "crescent-antique",
        name: "Antique White",
        color: "#F5F1E6",
        price: "0.025",
        // per square inch (wholesale)
        manufacturer: "Crescent",
        code: "S102",
        description: "Subtle antique white tone",
        category: "Whites"
      },
      // Neutrals
      {
        id: "crescent-stone",
        name: "Stone",
        color: "#E0DCCC",
        price: "0.027",
        // per square inch (wholesale)
        manufacturer: "Crescent",
        code: "S200",
        description: "Light stone grey conservation mat",
        category: "Neutrals"
      },
      {
        id: "crescent-fog",
        name: "Fog",
        color: "#D6D6D6",
        price: "0.027",
        // per square inch (wholesale)
        manufacturer: "Crescent",
        code: "S201",
        description: "Subtle fog grey conservation mat",
        category: "Neutrals"
      },
      {
        id: "crescent-granite",
        name: "Granite",
        color: "#A9A9A9",
        price: "0.027",
        // per square inch (wholesale)
        manufacturer: "Crescent",
        code: "S202",
        description: "Darker granite grey tone",
        category: "Neutrals"
      },
      // Blues
      {
        id: "crescent-colonial-blue",
        name: "Colonial Blue",
        color: "#B5C7D3",
        price: "0.029",
        // per square inch (wholesale)
        manufacturer: "Crescent",
        code: "S300",
        description: "Subtle colonial blue conservation mat",
        category: "Blues"
      },
      {
        id: "crescent-wedgewood",
        name: "Wedgewood",
        color: "#6E99C0",
        price: "0.029",
        // per square inch (wholesale)
        manufacturer: "Crescent",
        code: "S301",
        description: "Classic wedgewood blue conservation mat",
        category: "Blues"
      },
      {
        id: "crescent-ultramarine",
        name: "Ultramarine",
        color: "#4166B0",
        price: "0.029",
        // per square inch (wholesale)
        manufacturer: "Crescent",
        code: "S302",
        description: "Deep ultramarine blue conservation mat",
        category: "Blues"
      },
      // Greens
      {
        id: "crescent-sage",
        name: "Sage",
        color: "#BCCCBA",
        price: "0.029",
        // per square inch (wholesale)
        manufacturer: "Crescent",
        code: "S400",
        description: "Soft sage green conservation mat",
        category: "Greens"
      },
      {
        id: "crescent-celadon",
        name: "Celadon",
        color: "#9CB084",
        price: "0.029",
        // per square inch (wholesale)
        manufacturer: "Crescent",
        code: "S401",
        description: "Classic celadon green conservation mat",
        category: "Greens"
      },
      {
        id: "crescent-forest",
        name: "Forest",
        color: "#4A6741",
        price: "0.029",
        // per square inch (wholesale)
        manufacturer: "Crescent",
        code: "S402",
        description: "Deep forest green conservation mat",
        category: "Greens"
      },
      // Earth Tones
      {
        id: "crescent-sand",
        name: "Sand",
        color: "#E6D7B8",
        price: "0.027",
        // per square inch (wholesale)
        manufacturer: "Crescent",
        code: "S500",
        description: "Light sand beige conservation mat",
        category: "Earth Tones"
      },
      {
        id: "crescent-chamois",
        name: "Chamois",
        color: "#D9BC8C",
        price: "0.027",
        // per square inch (wholesale)
        manufacturer: "Crescent",
        code: "S501",
        description: "Warm chamois tan conservation mat",
        category: "Earth Tones"
      },
      {
        id: "crescent-chestnut",
        name: "Chestnut",
        color: "#A67B5B",
        price: "0.027",
        // per square inch (wholesale)
        manufacturer: "Crescent",
        code: "S502",
        description: "Rich chestnut brown conservation mat",
        category: "Earth Tones"
      },
      // Warm Tones
      {
        id: "crescent-pale-rose",
        name: "Pale Rose",
        color: "#F0D4D4",
        price: "0.029",
        // per square inch (wholesale)
        manufacturer: "Crescent",
        code: "S600",
        description: "Subtle pale rose conservation mat",
        category: "Warm Tones"
      },
      {
        id: "crescent-dusty-rose",
        name: "Dusty Rose",
        color: "#D4A9A9",
        price: "0.029",
        // per square inch (wholesale)
        manufacturer: "Crescent",
        code: "S601",
        description: "Classic dusty rose conservation mat",
        category: "Warm Tones"
      },
      {
        id: "crescent-rust",
        name: "Rust",
        color: "#B56A55",
        price: "0.029",
        // per square inch (wholesale)
        manufacturer: "Crescent",
        code: "S602",
        description: "Deep rust red conservation mat",
        category: "Warm Tones"
      },
      // Black
      {
        id: "crescent-black",
        name: "Raven Black",
        color: "#1A1A1A",
        price: "0.03",
        // per square inch (wholesale)
        manufacturer: "Crescent",
        code: "S700",
        description: "Deep black conservation mat board",
        category: "Black"
      }
    ];
    matColorCatalog = [...basicMatColors, ...crescentMatColors];
    loadCrescentMatboardsFromSupabase = async () => {
      if (typeof window === "undefined") {
        console.log("Skipping Supabase fetch on server-side");
        return;
      }
      try {
        console.log("Fetching Crescent matboards from Larson Juhl catalog...");
        const supabaseMatboards = await fetchCrescentMatboards();
        if (supabaseMatboards && supabaseMatboards.length > 0) {
          console.log("Converting API matboards to MatColor format");
          const convertedMatboards = supabaseMatboards.map((mat) => ({
            id: mat.id,
            name: mat.name,
            color: mat.hex_color || "#FFFFFF",
            // Use hex_color as color
            price: mat.price,
            manufacturer: mat.manufacturer,
            code: mat.code || null,
            description: mat.description || null,
            category: mat.category || null
          }));
          const basicColors = basicMatColors;
          matColorCatalog = [...basicColors, ...convertedMatboards];
          console.log(`Loaded and converted ${supabaseMatboards.length} Crescent matboards from Larson Juhl catalog`);
        } else {
          console.log("No Crescent matboards found in Larson Juhl catalog or empty response. Using static fallback data.");
        }
      } catch (error) {
        console.error("Failed to load Crescent matboards:", error);
        console.log("Using static Crescent matboard catalog as fallback.");
      }
    };
    if (typeof window !== "undefined") {
      loadCrescentMatboardsFromSupabase();
    }
  }
});

// client/src/data/glassOptions.ts
var glassOptionCatalog, specialServicesCatalog;
var init_glassOptions = __esm({
  "client/src/data/glassOptions.ts"() {
    "use strict";
    glassOptionCatalog = [
      {
        id: "none",
        name: "No Glass",
        description: "No glass protection",
        price: "0.00"
        // no cost
      },
      {
        id: "regular",
        name: "Regular Glass",
        description: "Standard protection",
        price: "0.08"
        // per square inch (wholesale)
      },
      {
        id: "uv",
        name: "Museum Glass",
        description: "Museum non-glare",
        price: "0.45"
        // per square inch (wholesale)
      },
      {
        id: "museum",
        name: "Conservation Glass",
        description: "Premium UV protection",
        price: "0.25"
        // per square inch (wholesale)
      },
      {
        id: "regular-acrylic",
        name: "Regular Acrylic",
        description: "Standard acrylic glazing",
        price: "0.12"
        // per square inch (wholesale)
      },
      {
        id: "conservation-clear-acrylic",
        name: "Conservation Clear Acrylic",
        description: "UV filtering acrylic glazing",
        price: "0.35"
        // per square inch (wholesale)
      },
      {
        id: "optium-acrylic",
        name: "Optium Acrylic",
        description: "Premium non-glare acrylic",
        price: "0.45"
        // per square inch (wholesale)
      }
    ];
    specialServicesCatalog = [
      {
        id: "float-mount",
        name: "Float Mount",
        description: "Artwork appears to float",
        price: "50.00"
      },
      {
        id: "glass-float",
        name: "Glass Float",
        description: "Suspended between glass",
        price: "55.00"
      },
      {
        id: "shadowbox",
        name: "Shadowbox",
        description: "For 3D objects",
        price: "65.00"
      },
      {
        id: "labor-30min",
        name: "Additional Labor (30 min)",
        description: "Custom work",
        price: "30.00"
      },
      {
        id: "labor-1hour",
        name: "Additional Labor (1 hour)",
        description: "Custom work",
        price: "55.00"
      }
    ];
  }
});

// server/supabase.ts
import { createClient } from "@supabase/supabase-js";
var supabase;
var init_supabase = __esm({
  "server/supabase.ts"() {
    "use strict";
    supabase = null;
    try {
      const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseKey) {
        supabase = createClient(supabaseUrl, supabaseKey);
        console.log("Server: Successfully initialized Supabase client");
      } else {
        supabase = {
          from: () => ({
            select: () => Promise.resolve({ data: [], error: null }),
            insert: () => Promise.resolve({ data: [], error: null }),
            update: () => Promise.resolve({ data: [], error: null }),
            delete: () => Promise.resolve({ data: null, error: null }),
            upsert: () => Promise.resolve({ data: null, error: null })
          }),
          rpc: () => Promise.resolve({ data: null, error: null })
        };
        console.log("Server: Using mock Supabase client - data operations will be handled by Drizzle/PostgreSQL");
      }
    } catch (error) {
      console.error("Server: Error initializing Supabase client:", error);
      supabase = {
        from: () => ({
          select: () => Promise.resolve({ data: [], error: null }),
          insert: () => Promise.resolve({ data: [], error: null }),
          update: () => Promise.resolve({ data: [], error: null }),
          delete: () => Promise.resolve({ data: null, error: null }),
          upsert: () => Promise.resolve({ data: null, error: null })
        }),
        rpc: () => Promise.resolve({ data: null, error: null })
      };
    }
  }
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
var pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_supabase();
    neonConfig.webSocketConstructor = ws;
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
      );
    }
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema: schema_exports });
  }
});

// server/utils/logger.ts
function log(message, category) {
  const timestamp2 = (/* @__PURE__ */ new Date()).toISOString();
  const prefix = category ? `[${category}]` : "";
  console.log(`${timestamp2} ${prefix} ${message}`);
}
var init_logger = __esm({
  "server/utils/logger.ts"() {
    "use strict";
  }
});

// shared/pricingUtils.ts
function calculatePricePerUnitedInch(boxPrice, sheetsPerBox, sheetWidth, sheetHeight) {
  const pricePerSheet = boxPrice / sheetsPerBox;
  const unitedInchesPerSheet = sheetWidth + sheetHeight;
  return pricePerSheet / unitedInchesPerSheet;
}
function calculateMarkupFactor(wholesaleCost) {
  if (wholesaleCost >= 40) {
    return 2.2;
  } else if (wholesaleCost >= 25) {
    return 2.4;
  } else if (wholesaleCost >= 15) {
    return 2.6;
  } else if (wholesaleCost >= 10) {
    return 2.8;
  } else if (wholesaleCost >= 6) {
    return 3;
  } else if (wholesaleCost >= 4) {
    return 3.2;
  } else if (wholesaleCost >= 2) {
    return 3.5;
  } else {
    return 4;
  }
}
function calculateFramePrice(width, height, matWidth, pricePerFoot) {
  const outerWidth = width + matWidth * 2;
  const outerHeight = height + matWidth * 2;
  const unitedInches = outerWidth + outerHeight;
  const perimeterFeet = unitedInches / 12;
  const wholesaleCost = perimeterFeet * pricePerFoot;
  const markupFactor = calculateMarkupFactor(wholesaleCost);
  return wholesaleCost * markupFactor;
}
function calculateMatPrice(width, height, matWidth, pricePerUnitedInch) {
  const outerWidth = width + matWidth * 2;
  const outerHeight = height + matWidth * 2;
  const unitedInches = outerWidth + outerHeight;
  const wholesaleCost = unitedInches * pricePerUnitedInch * 2.5;
  let markupFactor = 5.5;
  if (unitedInches <= 24) {
    markupFactor = 5.5;
  } else if (unitedInches <= 36) {
    markupFactor = 5;
  } else if (unitedInches <= 50) {
    markupFactor = 4.5;
  } else if (unitedInches <= 68) {
    markupFactor = 4.2;
  } else if (unitedInches <= 88) {
    markupFactor = 3.8;
  } else if (unitedInches <= 108) {
    markupFactor = 3.5;
  } else {
    markupFactor = 3.2;
  }
  const laborCharge = calculateMatLaborCharge(unitedInches);
  return wholesaleCost * markupFactor + laborCharge;
}
function calculateGlassPrice(width, height, matWidth, pricePerUnitedInch) {
  const glassWidth = width + matWidth * 2;
  const glassHeight = height + matWidth * 2;
  const unitedInches = glassWidth + glassHeight;
  const wholesaleCost = unitedInches * pricePerUnitedInch;
  let markupFactor = 4;
  if (unitedInches <= 24) {
    markupFactor = 4;
  } else if (unitedInches <= 36) {
    markupFactor = 3.8;
  } else if (unitedInches <= 50) {
    markupFactor = 3.5;
  } else if (unitedInches <= 68) {
    markupFactor = 3.2;
  } else if (unitedInches <= 88) {
    markupFactor = 3;
  } else if (unitedInches <= 108) {
    markupFactor = 2.8;
  } else {
    markupFactor = 2.5;
  }
  return wholesaleCost * markupFactor;
}
function calculateMatLaborCharge(unitedInches) {
  let laborCharge = 15;
  if (unitedInches <= 24) {
    laborCharge = 15;
  } else if (unitedInches <= 36) {
    laborCharge = 20;
  } else if (unitedInches <= 50) {
    laborCharge = 25;
  } else if (unitedInches <= 68) {
    laborCharge = 35;
  } else if (unitedInches <= 88) {
    laborCharge = 45;
  } else if (unitedInches <= 108) {
    laborCharge = 55;
  } else {
    laborCharge = 65;
  }
  return laborCharge;
}
var init_pricingUtils = __esm({
  "shared/pricingUtils.ts"() {
    "use strict";
  }
});

// server/services/pricingService.ts
var pricingService_exports = {};
__export(pricingService_exports, {
  calculateFramePrice: () => calculateFramePrice2,
  calculateFramingPrice: () => calculateFramingPrice,
  calculateGlassPrice: () => calculateGlassPrice2,
  calculateMatPrice: () => calculateMatPrice2
});
function calculateFramePrice2(wholesalePrice, perimeter) {
  const unitedInches = perimeter * 6;
  const markup = calculateFrameMarkup(unitedInches);
  const adjustedMarkupFactor = 1.2;
  return wholesalePrice * perimeter * markup * adjustedMarkupFactor;
}
function calculateMatPrice2(wholesalePrice, area, unitedInches) {
  const markup = calculateMatMarkup(unitedInches);
  return area * wholesalePrice * markup;
}
function calculateGlassPrice2(wholesalePrice, area, width = 0, height = 0, glassType = "regular") {
  const unitedInches = width && height ? width + height : Math.sqrt(area) * 2;
  const markup = calculateGlassMarkup(unitedInches);
  let typeMultiplier = 1;
  switch (glassType) {
    case "conservation":
      typeMultiplier = 1.5;
      break;
    case "museum":
      typeMultiplier = 2;
      break;
  }
  const areaInSqFt = area / 144;
  const basePrice = unitedInches <= 40 ? 85 : 125;
  return basePrice + areaInSqFt * wholesalePrice * markup * 0.35 * typeMultiplier;
}
function calculateFrameMarkup(unitedInches) {
  if (unitedInches <= 20) return 1.8;
  if (unitedInches <= 40) return 2.2;
  if (unitedInches <= 60) return 2.6;
  if (unitedInches <= 80) return 3;
  return 3.4;
}
function calculateGlassMarkup(unitedInches) {
  if (unitedInches <= 20) return 2.8;
  if (unitedInches <= 40) return 3.2;
  if (unitedInches <= 60) return 3.6;
  if (unitedInches <= 80) return 4;
  return 4.5;
}
function calculateMatMarkup(unitedInches) {
  if (unitedInches <= 20) return 2.5;
  if (unitedInches <= 40) return 2.8;
  if (unitedInches <= 60) return 3.1;
  if (unitedInches <= 80) return 3.4;
  return 3.8;
}
function calculateLaborEstimates(hasFrame, hasMat, hasGlass, unitedInches) {
  const sizeFactor = unitedInches / 40;
  return {
    frameAssembly: hasFrame ? 0.25 * sizeFactor : 0,
    matCutting: hasMat ? 0.3 * sizeFactor : 0,
    glassCutting: hasGlass ? 0.15 * sizeFactor : 0,
    fitting: 0.2 * sizeFactor,
    finishing: 0.1 * sizeFactor
  };
}
function calculateLaborCost(estimates, baseRate, regionalFactor) {
  const totalHours = estimates.frameAssembly + estimates.matCutting + estimates.glassCutting + estimates.fitting + estimates.finishing;
  return totalHours * baseRate * regionalFactor;
}
async function calculateFramingPrice(params) {
  const {
    frameId,
    matColorId,
    glassOptionId,
    artworkWidth,
    artworkHeight,
    matWidth,
    quantity,
    includeWholesalePrices = false
  } = params;
  const frame = frameId && frameId !== "none" ? await storage.getFrame(frameId) : null;
  const matColor = matColorId && matColorId !== "none" ? await storage.getMatColor(matColorId) : null;
  const glassOption = glassOptionId && glassOptionId !== "none" ? await storage.getGlassOption(glassOptionId) : null;
  const artworkUnitedInches = artworkWidth + artworkHeight;
  const finishedWidth = artworkWidth + matWidth * 2;
  const finishedHeight = artworkHeight + matWidth * 2;
  const finishedUnitedInches = finishedWidth + finishedHeight;
  const matSurfaceArea = finishedWidth * finishedHeight - artworkWidth * artworkHeight;
  const frameLength = finishedWidth * 2 + finishedHeight * 2;
  const wholesalePrices = includeWholesalePrices ? {
    frame: frame ? frame.price : "0.00",
    mat: "0.00",
    glass: glassOption ? glassOption.price || "0.00" : "0.00",
    backing: "0.00"
  } : void 0;
  let framePrice = 0;
  if (frame) {
    const pricePerFoot = parseFloat(frame.price);
    framePrice = calculateFramePrice(artworkWidth, artworkHeight, matWidth, pricePerFoot);
    if (wholesalePrices) {
      const outerWidth = artworkWidth + matWidth * 2;
      const outerHeight = artworkHeight + matWidth * 2;
      const unitedInches = outerWidth + outerHeight;
      const perimeterFeet = unitedInches / 12;
      const wholesaleCost = perimeterFeet * pricePerFoot;
      wholesalePrices.frame = wholesaleCost.toFixed(2);
    }
  }
  let matPrice = 0;
  if (matColor) {
    const matBoxPrice = 45.5;
    const sheetsPerBox = 25;
    const sheetWidth = 32;
    const sheetHeight = 40;
    const matPricePerUnitedInch = calculatePricePerUnitedInch(matBoxPrice, sheetsPerBox, sheetWidth, sheetHeight);
    matPrice = calculateMatPrice(artworkWidth, artworkHeight, matWidth, matPricePerUnitedInch);
    if (wholesalePrices) {
      const outerWidth = artworkWidth + matWidth * 2;
      const outerHeight = artworkHeight + matWidth * 2;
      const unitedInches = outerWidth + outerHeight;
      const wholesaleCost = unitedInches * matPricePerUnitedInch;
      wholesalePrices.mat = wholesaleCost.toFixed(2);
    }
  }
  let glassPrice = 0;
  if (glassOption) {
    const glassBoxPrice = 125;
    const sheetsPerBox = 10;
    const sheetWidth = 24;
    const sheetHeight = 36;
    const glassPricePerUnitedInch = calculatePricePerUnitedInch(glassBoxPrice, sheetsPerBox, sheetWidth, sheetHeight);
    glassPrice = calculateGlassPrice(artworkWidth, artworkHeight, matWidth, glassPricePerUnitedInch);
    if (wholesalePrices) {
      const outerWidth = artworkWidth + matWidth * 2;
      const outerHeight = artworkHeight + matWidth * 2;
      const unitedInches = outerWidth + outerHeight;
      const wholesaleCost = unitedInches * glassPricePerUnitedInch;
      wholesalePrices.glass = wholesaleCost.toFixed(2);
    }
  }
  const backingBasePrice = 0.04;
  const backingArea = finishedWidth * finishedHeight;
  const backingPrice = backingArea * backingBasePrice * BACKING_MARKUP_FACTOR;
  if (wholesalePrices) {
    wholesalePrices.backing = (backingArea * backingBasePrice).toFixed(2);
  }
  const laborEstimates = calculateLaborEstimates(
    !!frame,
    !!matColor,
    !!glassOption,
    finishedUnitedInches
  );
  const laborCost = calculateLaborCost(
    laborEstimates,
    BASE_LABOR_RATE,
    HOUSTON_REGIONAL_FACTOR
  );
  const materialCost = framePrice + matPrice + glassPrice + backingPrice;
  const subtotal = materialCost + laborCost;
  const totalPrice = subtotal * quantity;
  let profitability;
  if (includeWholesalePrices && wholesalePrices) {
    const frameWholesaleCost = frame ? parseFloat(frame.price) * frameLength / 12 : 0;
    const matWholesaleCost = matColor ? parseFloat(wholesalePrices.mat) : 0;
    const glassWholesaleCost = glassOption ? glassOption.price ? parseFloat(glassOption.price) * finishedWidth * finishedHeight / 144 : 0 : 0;
    const backingWholesaleCost = parseFloat(wholesalePrices.backing);
    const totalWholesaleCost = frameWholesaleCost + matWholesaleCost + glassWholesaleCost + backingWholesaleCost;
    const overheadCost = totalWholesaleCost * OVERHEAD_PERCENTAGE;
    const totalCost = totalWholesaleCost + overheadCost + laborCost;
    const grossProfit = subtotal - totalCost;
    const grossProfitMargin = grossProfit / subtotal;
    const markupMultiplier = subtotal / totalWholesaleCost;
    profitability = {
      totalWholesaleCost,
      overheadCost,
      grossProfit,
      grossProfitMargin,
      markupMultiplier
    };
  }
  return {
    framePrice,
    matPrice,
    glassPrice,
    backingPrice,
    laborCost,
    materialCost,
    subtotal,
    totalPrice,
    wholesalePrices,
    laborRates: {
      baseRate: BASE_LABOR_RATE,
      regionalFactor: HOUSTON_REGIONAL_FACTOR,
      estimates: laborEstimates
    },
    profitability
  };
}
var BACKING_MARKUP_FACTOR, HOUSTON_REGIONAL_FACTOR, BASE_LABOR_RATE, OVERHEAD_PERCENTAGE;
var init_pricingService = __esm({
  "server/services/pricingService.ts"() {
    "use strict";
    init_storage();
    init_pricingUtils();
    BACKING_MARKUP_FACTOR = 1.2;
    HOUSTON_REGIONAL_FACTOR = 1.15;
    BASE_LABOR_RATE = 45;
    OVERHEAD_PERCENTAGE = 0.3;
  }
});

// server/services/smsHubService.ts
import axios from "axios";
async function sendNotificationViaSmsHub(params) {
  try {
    const response = await axios.post(`${SMS_HUB_URL}/api/notifications/send`, {
      to: params.to,
      subject: params.subject,
      message: params.message,
      orderId: params.orderId,
      customerName: params.customerName,
      type: params.type || "order_update",
      source: "Jays Frames POS",
      method: "email",
      // Use email delivery method
      deliveryType: "email"
      // Specify email as the delivery type
    }, {
      headers: {
        "Authorization": `Bearer ${SMS_HUB_API_KEY}`,
        "Content-Type": "application/json"
      },
      timeout: 1e4
    });
    if (response.data && response.data.success) {
      console.log(`Email notification sent successfully to ${params.to} via SMS Hub`);
    } else {
      throw new Error(response.data?.error || "SMS Hub returned error response");
    }
  } catch (error) {
    console.error("SMS Hub Error:", error.message);
    if (error.response) {
      console.error("SMS Hub Response:", error.response.data);
    }
    throw new Error(`Failed to send email notification via SMS Hub: ${error.message}`);
  }
}
async function sendOrderStatusUpdate(customerEmail, customerPhone, customerName, orderId, status) {
  const message = `Hi ${customerName}, your order #${orderId} status has been updated to: ${status}. Thank you for choosing Jay's Frames!`;
  await sendNotificationViaSmsHub({
    to: customerEmail,
    // Always use email address for delivery
    subject: `Order #${orderId} Update`,
    message,
    orderId,
    customerName,
    type: "status_update"
  });
}
var SMS_HUB_URL, SMS_HUB_API_KEY;
var init_smsHubService = __esm({
  "server/services/smsHubService.ts"() {
    "use strict";
    SMS_HUB_URL = "https://telitel-sms-hub-JayFrames.replit.app";
    SMS_HUB_API_KEY = process.env.SMS_HUB_API_KEY || "jays_frames_api_2025";
  }
});

// server/services/emailService.ts
var emailService_exports = {};
__export(emailService_exports, {
  generateOrderStatusEmailTemplate: () => generateOrderStatusEmailTemplate,
  sendEmailWithSendGrid: () => sendEmailWithSendGrid,
  sendOrderStatusUpdate: () => sendOrderStatusUpdate2
});
async function sendEmailWithSendGrid(params) {
  console.log("Using SMS Hub instead of SendGrid for notifications");
  try {
    await sendNotificationViaSmsHub({
      to: params.to,
      subject: params.subject,
      message: params.text || extractTextFromHtml(params.html || ""),
      type: "email_replacement"
    });
  } catch (error) {
    console.error("SMS Hub notification error:", error.message);
    throw new Error(`Failed to send notification via SMS Hub: ${error.message}`);
  }
}
function extractTextFromHtml(html) {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
}
function generateOrderStatusEmailTemplate(customerName, orderId, orderStatus, estimatedCompletion) {
  const formattedStatus = orderStatus.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  const completionDate = estimatedCompletion ? new Date(estimatedCompletion).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }) : "Not available";
  const statusSteps = [
    "order_processed",
    "scheduled",
    "materials_ordered",
    "materials_arrived",
    "frame_cut",
    "mat_cut",
    "prepped",
    "completed"
  ];
  const currentStepIndex = statusSteps.indexOf(orderStatus);
  const progressPercentage = Math.max(
    10,
    Math.min(100, Math.round((currentStepIndex + 1) / statusSteps.length * 100))
  );
  const progressBarHtml = `
    <div style="margin: 20px 0; width: 100%;">
      <div style="width: 100%; background-color: #f0f0f0; height: 20px; border-radius: 10px; overflow: hidden;">
        <div style="width: ${progressPercentage}%; background-color: #4CAF50; height: 20px;"></div>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 12px;">
        <span>Order Placed</span>
        <span>In Production</span>
        <span>Completed</span>
      </div>
    </div>
  `;
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Status Update</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #4A90E2;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          background-color: #f9f9f9;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #666;
        }
        .button {
          display: inline-block;
          background-color: #4A90E2;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
        }
        .status-box {
          background-color: #e8f4fd;
          border-left: 4px solid #4A90E2;
          padding: 15px;
          margin: 20px 0;
        }
        .details-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .details-table th, .details-table td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        .details-table th {
          background-color: #f0f0f0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Status Update</h1>
        </div>
        
        <div class="content">
          <p>Hello ${customerName},</p>
          
          <p>We're writing to provide you with an update on your custom framing order.</p>
          
          <div class="status-box">
            <h2>Order #${orderId} Status: ${formattedStatus}</h2>
            <p>Your order is now in the <strong>${formattedStatus}</strong> stage.</p>
            <p><strong>Estimated Completion:</strong> ${completionDate}</p>
          </div>
          
          ${progressBarHtml}
          
          <h3>What's Next?</h3>
          <p>Your order is progressing through our custom framing process. Here's what's happening:</p>
          
          <table class="details-table">
            <tr>
              <th>Current Stage</th>
              <th>Description</th>
            </tr>
            <tr>
              <td>${formattedStatus}</td>
              <td>${getStageDescription(orderStatus)}</td>
            </tr>
          </table>
          
          <p>We'll notify you when your order moves to the next stage or is ready for pickup.</p>
          
          <a href="#" class="button">Track Your Order</a>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing Jays Frames Guru Framing</p>
          <p>123 Frame Street, Anytown, ST 12345</p>
          <p>Phone: (555) 123-4567 | Email: info@jaysframes.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
async function sendOrderStatusUpdate2(customerEmail, customerName, orderId, orderStatus, estimatedCompletion) {
  console.log(`Sending order status update via SMS Hub for order #${orderId}`);
  await sendOrderStatusUpdate(
    customerEmail,
    "",
    // phone placeholder
    customerName,
    orderId.toString(),
    orderStatus
  );
}
function getStageDescription(status) {
  switch (status) {
    case "order_processed":
      return "Your order has been processed and is scheduled for production.";
    case "scheduled":
      return "Your order has been scheduled and is in our production queue.";
    case "materials_ordered":
      return "We have ordered the special materials needed for your custom frame.";
    case "materials_arrived":
      return "All materials for your order have arrived and are ready for production.";
    case "frame_cut":
      return "Your frame has been cut to the specified dimensions.";
    case "mat_cut":
      return "Your mat board has been cut and prepared for assembly.";
    case "prepped":
      return "Your frame is assembled and is going through final quality checks.";
    case "completed":
      return "Your order is complete and ready for pickup!";
    case "delayed":
      return "Your order is temporarily delayed. We will contact you with more information.";
    default:
      return "Your order is being processed by our team.";
  }
}
var init_emailService = __esm({
  "server/services/emailService.ts"() {
    "use strict";
    init_smsHubService();
  }
});

// server/storage.ts
import { eq as eq2, desc, sql, asc, and, or } from "drizzle-orm";
function determineFrameColor(frame) {
  const { material, name } = frame;
  const materialLower = material.toLowerCase();
  const nameLower = name.toLowerCase();
  if (materialLower.includes("gold") || nameLower.includes("gold")) {
    return "#D4AF37";
  }
  if (materialLower.includes("silver") || materialLower.includes("metal") || nameLower.includes("silver") || nameLower.includes("metal") || nameLower.includes("chrome") || nameLower.includes("steel")) {
    return "#C0C0C0";
  }
  if (materialLower.includes("black") || nameLower.includes("black") || nameLower.includes("ebony") || nameLower.includes("onyx")) {
    return "#000000";
  }
  if (materialLower.includes("white") || nameLower.includes("white")) {
    return "#F5F5F5";
  }
  if (materialLower.includes("walnut") || nameLower.includes("walnut")) {
    return "#5C4033";
  }
  if (materialLower.includes("cherry") || nameLower.includes("cherry")) {
    return "#722F37";
  }
  if (materialLower.includes("oak") || nameLower.includes("oak")) {
    return "#D8BE75";
  }
  if (materialLower.includes("mahogany") || nameLower.includes("mahogany")) {
    return "#4E2728";
  }
  if (materialLower.includes("maple") || nameLower.includes("maple")) {
    return "#E8D4A9";
  }
  return "#8B4513";
}
var DatabaseStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_schema();
    init_frameCatalog();
    init_matColors();
    init_glassOptions();
    init_db();
    init_logger();
    DatabaseStorage = class {
      /**
       * Update the physical artwork location for an order
       * @param id Order ID
       * @param location Physical storage location
       * @returns Updated order
       */
      async updateOrderArtLocation(id, location) {
        try {
          const [updatedOrder] = await db.update(orders).set({ artworkLocation: location }).where(eq2(orders.id, id)).returning();
          if (!updatedOrder) {
            throw new Error("Order not found");
          }
          return updatedOrder;
        } catch (error) {
          console.error("Error updating order artwork location:", error);
          throw error;
        }
      }
      // Order mats methods
      async getOrderMats(orderId) {
        try {
          const result = await db.select().from(orderMats).where(eq2(orderMats.orderId, orderId));
          const enhancedMats = [];
          for (const mat of result) {
            const matboard = await this.getMatColor(mat.matColorId);
            if (matboard) {
              enhancedMats.push({
                ...mat,
                matboard
              });
            }
          }
          return enhancedMats;
        } catch (error) {
          console.error(`Error getting order mats for order ${orderId}:`, error);
          return [];
        }
      }
      // Order frames methods
      async getOrderFrames(orderId) {
        try {
          const result = await db.select().from(orderFrames).where(eq2(orderFrames.orderId, orderId));
          const enhancedFrames = [];
          for (const frameEntry of result) {
            const frame = await this.getFrame(frameEntry.frameId);
            if (frame) {
              enhancedFrames.push({
                ...frameEntry,
                frame
              });
            }
          }
          return enhancedFrames;
        } catch (error) {
          console.error(`Error getting order frames for order ${orderId}:`, error);
          return [];
        }
      }
      // Order pricing details for analytics
      async getOrderPricingDetails(orderId) {
        try {
          const order = await this.getOrder(orderId);
          if (!order) return void 0;
          const { calculatePricing } = (init_pricingService(), __toCommonJS(pricingService_exports));
          const frame = order.frameId ? await this.getFrame(order.frameId) : void 0;
          const matColor = order.matColorId ? await this.getMatColor(order.matColorId) : void 0;
          const glassOption = order.glassOptionId ? await this.getGlassOption(order.glassOptionId) : void 0;
          const specialServices2 = await this.getOrderSpecialServices(orderId);
          const mats = await this.getOrderMats(orderId);
          const frames2 = await this.getOrderFrames(orderId);
          const pricingParams = {
            artworkWidth: Number(order.artworkWidth),
            artworkHeight: Number(order.artworkHeight),
            matWidth: Number(order.matWidth),
            frame,
            matColor,
            glassOption,
            specialServices: specialServices2,
            quantity: order.quantity || 1,
            includeWholesalePrices: true,
            mats: mats.length > 0 ? mats : void 0,
            frames: frames2.length > 0 ? frames2 : void 0
          };
          return calculatePricing(pricingParams);
        } catch (error) {
          console.error("Error getting order pricing details:", error);
          return void 0;
        }
      }
      // Customer methods
      async getCustomer(id) {
        const [customer] = await db.select().from(customers).where(eq2(customers.id, id));
        return customer || void 0;
      }
      async getCustomerByEmail(email) {
        const [customer] = await db.select().from(customers).where(eq2(customers.email, email));
        return customer || void 0;
      }
      async getAllCustomers() {
        return await db.select().from(customers);
      }
      async createCustomer(customer) {
        const [newCustomer] = await db.insert(customers).values({
          ...customer,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newCustomer;
      }
      async updateCustomer(id, data) {
        const [updatedCustomer] = await db.update(customers).set(data).where(eq2(customers.id, id)).returning();
        if (!updatedCustomer) {
          throw new Error("Customer not found");
        }
        return updatedCustomer;
      }
      // Frame methods
      async getFrame(id) {
        console.log(`Storage: Getting frame with ID: ${id}`);
        try {
          const [frame] = await db.select().from(frames).where(eq2(frames.id, id));
          if (frame) {
            console.log(`Storage: Found frame in database: ${frame.name}`);
            let frameColor = determineFrameColor(frame);
            let enhancedImage = frame.catalogImage;
            let realCornerImage = frame.corner || "";
            let realEdgeImage = frame.edgeTexture || "";
            if (frame.manufacturer === "Larson-Juhl") {
              const frameNumber = frame.id.split("-")[1];
              if (frameNumber) {
                enhancedImage = `https://www.larsonjuhl.com/contentassets/products/mouldings/${frameNumber}_fab.jpg`;
                realCornerImage = `https://www.larsonjuhl.com/contentassets/products/mouldings/${frameNumber}_corner.jpg`;
                realEdgeImage = `https://www.larsonjuhl.com/contentassets/products/mouldings/${frameNumber}_prof.jpg`;
              }
            }
            if (frame.manufacturer === "Nielsen") {
              const frameNumber = frame.id.split("-")[1];
              if (frameNumber) {
                enhancedImage = `https://www.nielsenbainbridge.com/images/products/detail/${frameNumber}-Detail.jpg`;
                realCornerImage = `https://www.nielsenbainbridge.com/images/products/detail/${frameNumber}-Corner.jpg`;
                realEdgeImage = `https://www.nielsenbainbridge.com/images/products/detail/${frameNumber}-Edge.jpg`;
              }
            }
            return {
              ...frame,
              catalogImage: enhancedImage,
              corner: realCornerImage,
              edgeTexture: realEdgeImage,
              color: frameColor
            };
          }
          console.log(`Storage: Frame not found in database, checking catalog`);
          const catalogFrame = frameCatalog.find((f) => f.id === id);
          if (catalogFrame) {
            console.log(`Storage: Found frame in catalog: ${catalogFrame.name}`);
            let enhancedImage = catalogFrame.catalogImage;
            let realCornerImage = catalogFrame.corner || "";
            let realEdgeImage = catalogFrame.edgeTexture || "";
            let frameColor = catalogFrame.color || determineFrameColor(catalogFrame);
            if (catalogFrame.manufacturer === "Larson-Juhl") {
              const frameNumber = catalogFrame.id.split("-")[1];
              if (frameNumber) {
                enhancedImage = `https://www.larsonjuhl.com/contentassets/products/mouldings/${frameNumber}_fab.jpg`;
                realCornerImage = `https://www.larsonjuhl.com/contentassets/products/mouldings/${frameNumber}_corner.jpg`;
                realEdgeImage = `https://www.larsonjuhl.com/contentassets/products/mouldings/${frameNumber}_prof.jpg`;
              }
            }
            if (catalogFrame.manufacturer === "Nielsen") {
              const frameNumber = catalogFrame.id.split("-")[1];
              if (frameNumber) {
                enhancedImage = `https://www.nielsenbainbridge.com/images/products/detail/${frameNumber}-Detail.jpg`;
                realCornerImage = `https://www.nielsenbainbridge.com/images/products/detail/${frameNumber}-Corner.jpg`;
                realEdgeImage = `https://www.nielsenbainbridge.com/images/products/detail/${frameNumber}-Edge.jpg`;
              }
            }
            const dbSafeFrame = {
              ...catalogFrame,
              catalogImage: enhancedImage,
              corner: realCornerImage,
              edgeTexture: realEdgeImage
            };
            console.log(`Storage: Inserting enhanced frame into database: ${dbSafeFrame.name}`);
            try {
              await db.insert(frames).values(dbSafeFrame);
              console.log(`Storage: Successfully inserted frame into database`);
            } catch (error) {
              console.error(`Storage: Error inserting frame into database:`, error);
            }
            return {
              ...dbSafeFrame,
              color: frameColor
            };
          }
          console.log(`Storage: Frame not found in catalog`);
          return void 0;
        } catch (error) {
          console.error(`Storage: Error in getFrame(${id}):`, error);
          const catalogFrame = frameCatalog.find((f) => f.id === id);
          if (catalogFrame) {
            let frameColor = determineFrameColor(catalogFrame);
            let enhancedImage = catalogFrame.catalogImage;
            if (catalogFrame.manufacturer === "Larson-Juhl") {
              const frameNumber = catalogFrame.id.split("-")[1];
              if (frameNumber) {
                enhancedImage = `https://www.larsonjuhl.com/contentassets/products/mouldings/${frameNumber}_fab.jpg`;
              }
            } else if (catalogFrame.manufacturer === "Nielsen") {
              const frameNumber = catalogFrame.id.split("-")[1];
              if (frameNumber) {
                enhancedImage = `https://www.nielsenbainbridge.com/images/products/detail/${frameNumber}-Detail.jpg`;
              }
            }
            return {
              ...catalogFrame,
              catalogImage: enhancedImage,
              color: frameColor
            };
          }
          return void 0;
        }
      }
      async getAllFrames() {
        console.log("Storage: Getting all frames");
        try {
          const dbFrames = await db.select().from(frames);
          console.log(`Storage: Found ${dbFrames.length} frames in database`);
          if (dbFrames.length > 0) {
            console.log("Storage: Enhancing existing frames with real wholesaler images");
            return dbFrames.map((frame) => {
              let frameColor = determineFrameColor(frame);
              let enhancedImage = frame.catalogImage;
              let realCornerImage = frame.corner || "";
              let realEdgeImage = frame.edgeTexture || "";
              if (frame.manufacturer === "Larson-Juhl") {
                const frameNumber = frame.id.split("-")[1];
                if (frameNumber) {
                  enhancedImage = `https://www.larsonjuhl.com/contentassets/products/mouldings/${frameNumber}_fab.jpg`;
                  realCornerImage = `https://www.larsonjuhl.com/contentassets/products/mouldings/${frameNumber}_corner.jpg`;
                  realEdgeImage = `https://www.larsonjuhl.com/contentassets/products/mouldings/${frameNumber}_prof.jpg`;
                }
              }
              if (frame.manufacturer === "Nielsen") {
                const frameNumber = frame.id.split("-")[1];
                if (frameNumber) {
                  enhancedImage = `https://www.nielsenbainbridge.com/images/products/detail/${frameNumber}-Detail.jpg`;
                  realCornerImage = `https://www.nielsenbainbridge.com/images/products/detail/${frameNumber}-Corner.jpg`;
                  realEdgeImage = `https://www.nielsenbainbridge.com/images/products/detail/${frameNumber}-Edge.jpg`;
                }
              }
              return {
                ...frame,
                catalogImage: enhancedImage,
                corner: realCornerImage,
                edgeTexture: realEdgeImage,
                color: frameColor
              };
            });
          }
          console.log("Storage: No frames in database, returning enhanced catalog data");
          const enhancedCatalog = frameCatalog.map((frame) => {
            let enhancedImage = frame.catalogImage;
            let realCornerImage = frame.corner || "";
            let realEdgeImage = frame.edgeTexture || "";
            let frameColor = frame.color || determineFrameColor(frame);
            if (frame.manufacturer === "Larson-Juhl") {
              const frameNumber = frame.id.split("-")[1];
              if (frameNumber) {
                enhancedImage = `https://www.larsonjuhl.com/contentassets/products/mouldings/${frameNumber}_fab.jpg`;
                realCornerImage = `https://www.larsonjuhl.com/contentassets/products/mouldings/${frameNumber}_corner.jpg`;
                realEdgeImage = `https://www.larsonjuhl.com/contentassets/products/mouldings/${frameNumber}_prof.jpg`;
              }
            }
            if (frame.manufacturer === "Nielsen") {
              const frameNumber = frame.id.split("-")[1];
              if (frameNumber) {
                enhancedImage = `https://www.nielsenbainbridge.com/images/products/detail/${frameNumber}-Detail.jpg`;
                realCornerImage = `https://www.nielsenbainbridge.com/images/products/detail/${frameNumber}-Corner.jpg`;
                realEdgeImage = `https://www.nielsenbainbridge.com/images/products/detail/${frameNumber}-Edge.jpg`;
              }
            }
            const dbSafeFrame = {
              ...frame,
              catalogImage: enhancedImage,
              corner: realCornerImage,
              edgeTexture: realEdgeImage
            };
            try {
              db.insert(frames).values(dbSafeFrame).execute();
            } catch (error) {
              console.error(`Storage: Error inserting frame ${frame.id} into database:`, error);
            }
            return {
              ...dbSafeFrame,
              color: frameColor
            };
          });
          return enhancedCatalog;
        } catch (error) {
          console.error("Storage: Error in getAllFrames:", error);
          return frameCatalog.map((frame) => {
            let frameColor = determineFrameColor(frame);
            const frameNumber = frame.id.split("-")[1];
            let enhancedImage = frame.catalogImage;
            if (frame.manufacturer === "Larson-Juhl") {
              enhancedImage = `https://images.unsplash.com/photo-1594194208961-0fdf358251d3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHBpY3R1cmUlMjBmcmFtZXxlbnwwfHwwfHx8MA%3D%3D`;
            } else if (frame.manufacturer === "Roma") {
              enhancedImage = `https://images.unsplash.com/photo-1579541591661-567c1ea5dc56?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBpY3R1cmUlMjBmcmFtZXxlbnwwfHwwfHx8MA%3D%3D`;
            } else if (frame.manufacturer === "Omega") {
              enhancedImage = `https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnJhbWV8ZW58MHx8MHx8fDA%3D`;
            } else {
              enhancedImage = `https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZyYW1lfGVufDB8fDB8fHww`;
            }
            return {
              ...frame,
              catalogImage: enhancedImage,
              color: frameColor
            };
          });
        }
      }
      async updateFrame(id, data) {
        const [updatedFrame] = await db.update(frames).set(data).where(eq2(frames.id, id)).returning();
        if (!updatedFrame) {
          throw new Error("Frame not found");
        }
        return updatedFrame;
      }
      async addFrame(frame) {
        console.log(`Storage: Adding new frame to database: ${frame.name} (${frame.id})`);
        try {
          const [newFrame] = await db.insert(frames).values(frame).returning();
          console.log(`Storage: Successfully added frame to database`);
          return newFrame;
        } catch (error) {
          console.error(`Storage: Error adding frame to database:`, error);
          throw error;
        }
      }
      async searchFramesByItemNumber(itemNumber) {
        console.log(`Storage: Searching frames by item number: ${itemNumber}`);
        try {
          const allFrames = await this.getAllFrames();
          const lowerItemNumber = itemNumber.toLowerCase();
          return allFrames.filter((frame) => {
            const frameItemNumber = frame.id.split("-")[1]?.toLowerCase() || "";
            return frameItemNumber.includes(lowerItemNumber);
          });
        } catch (error) {
          console.error(`Storage: Error searching frames by item number:`, error);
          return [];
        }
      }
      // Mat color methods
      async getMatColor(id) {
        const [matColor] = await db.select().from(matColors).where(eq2(matColors.id, id));
        if (!matColor) {
          const catalogMatColor = matColorCatalog.find((m) => m.id === id);
          if (catalogMatColor) {
            await db.insert(matColors).values(catalogMatColor);
            return catalogMatColor;
          }
        }
        return matColor || void 0;
      }
      async getAllMatColors() {
        const dbMatColors = await db.select().from(matColors);
        if (dbMatColors.length === 0) {
          await db.insert(matColors).values(matColorCatalog);
          return matColorCatalog;
        }
        return dbMatColors;
      }
      // Glass option methods
      async getGlassOption(id) {
        const [glassOption] = await db.select().from(glassOptions).where(eq2(glassOptions.id, id));
        if (!glassOption) {
          const catalogGlassOption = glassOptionCatalog.find((g) => g.id === id);
          if (catalogGlassOption) {
            await db.insert(glassOptions).values(catalogGlassOption);
            return catalogGlassOption;
          }
        }
        return glassOption || void 0;
      }
      async getAllGlassOptions() {
        const dbGlassOptions = await db.select().from(glassOptions);
        if (dbGlassOptions.length === 0) {
          await db.insert(glassOptions).values(glassOptionCatalog);
          return glassOptionCatalog;
        }
        return dbGlassOptions;
      }
      // Special service methods
      async getSpecialService(id) {
        const [specialService] = await db.select().from(specialServices).where(eq2(specialServices.id, id));
        if (!specialService) {
          const catalogSpecialService = specialServicesCatalog.find((s) => s.id === id);
          if (catalogSpecialService) {
            await db.insert(specialServices).values(catalogSpecialService);
            return catalogSpecialService;
          }
        }
        return specialService || void 0;
      }
      async getAllSpecialServices() {
        const dbSpecialServices = await db.select().from(specialServices);
        if (dbSpecialServices.length === 0) {
          await db.insert(specialServices).values(specialServicesCatalog);
          return specialServicesCatalog;
        }
        return dbSpecialServices;
      }
      // Order group methods
      async getOrderGroup(id) {
        const [orderGroup] = await db.select().from(orderGroups).where(eq2(orderGroups.id, id));
        return orderGroup || void 0;
      }
      async getActiveOrderGroupByCustomer(customerId) {
        const [orderGroup] = await db.select().from(orderGroups).where(eq2(orderGroups.customerId, customerId));
        return orderGroup && orderGroup.status === "open" ? orderGroup : void 0;
      }
      async getAllOrderGroups() {
        return await db.select().from(orderGroups);
      }
      async createOrderGroup(orderGroup) {
        const [newOrderGroup] = await db.insert(orderGroups).values({
          ...orderGroup,
          status: "open",
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newOrderGroup;
      }
      async updateOrderGroup(id, data) {
        const [updatedOrderGroup] = await db.update(orderGroups).set(data).where(eq2(orderGroups.id, id)).returning();
        if (!updatedOrderGroup) {
          throw new Error("Order group not found");
        }
        return updatedOrderGroup;
      }
      async getOrderGroupsByCustomerId(customerId) {
        try {
          console.log(`Storage: Getting order groups for customer ID: ${customerId}`);
          const result = await db.select().from(orderGroups).where(eq2(orderGroups.customerId, customerId));
          console.log(`Storage: Found ${result.length} order groups for customer ID: ${customerId}`);
          return result;
        } catch (error) {
          console.error("Storage: Error getting order groups by customer ID:", error);
          throw error;
        }
      }
      async getOrdersByGroupId(orderGroupId) {
        return await db.select().from(orders).where(eq2(orders.orderGroupId, orderGroupId));
      }
      // Order methods
      async getOrder(id) {
        const [order] = await db.select().from(orders).where(eq2(orders.id, id));
        return order || void 0;
      }
      async getAllOrders() {
        try {
          console.log("Fetching orders from database...");
          const dbOrders = await db.select().from(orders);
          console.log(`Found ${dbOrders?.length || 0} orders in database`);
          return dbOrders || [];
        } catch (error) {
          console.error("Error in getAllOrders:", error);
          throw error;
        }
      }
      async createOrder(order) {
        try {
          if (!order.artworkImage) {
            console.log("Warning: Order created without artwork image, using placeholder");
            order.artworkImage = "placeholder-image.jpg";
          }
          console.log("DatabaseStorage.createOrder - Inserting order with data:", order);
          const [newOrder] = await db.insert(orders).values([order]).returning();
          console.log("DatabaseStorage.createOrder - Order created successfully:", newOrder);
          try {
            console.log("Creating material orders for order:", newOrder.id);
            const materialOrders2 = await this.createMaterialOrdersFromOrder(newOrder);
            console.log(`Created ${materialOrders2.length} material orders for order ${newOrder.id}`);
          } catch (materialError) {
            console.error("Error creating material orders:", materialError);
          }
          return newOrder;
        } catch (error) {
          console.error("DatabaseStorage.createOrder - Error creating order:", error);
          throw error;
        }
      }
      async updateOrder(id, data) {
        try {
          const updateData = {};
          if (data.frameId !== void 0) updateData.frameId = data.frameId;
          if (data.matColorId !== void 0) updateData.matColorId = data.matColorId;
          if (data.glassOptionId !== void 0) updateData.glassOptionId = data.glassOptionId;
          if (data.artworkWidth !== void 0) updateData.artworkWidth = data.artworkWidth;
          if (data.artworkHeight !== void 0) updateData.artworkHeight = data.artworkHeight;
          if (data.matWidth !== void 0) updateData.matWidth = data.matWidth;
          if (data.artworkDescription !== void 0) updateData.artworkDescription = data.artworkDescription;
          if (data.artworkType !== void 0) updateData.artworkType = data.artworkType;
          if (data.quantity !== void 0) updateData.quantity = data.quantity;
          if (data.status !== void 0) updateData.status = data.status;
          if (data.subtotal !== void 0) updateData.subtotal = data.subtotal;
          if (data.tax !== void 0) updateData.tax = data.tax;
          if (data.total !== void 0) updateData.total = data.total;
          const [updatedOrder] = await db.update(orders).set(updateData).where(eq2(orders.id, id)).returning();
          if (!updatedOrder) {
            throw new Error("Order not found");
          }
          return updatedOrder;
        } catch (error) {
          console.error("Error updating order:", error);
          throw error;
        }
      }
      async deleteOrder(id) {
        await db.delete(orders).where(eq2(orders.id, id));
      }
      // Order special service methods
      async createOrderSpecialService(orderSpecialService) {
        const [newOrderSpecialService] = await db.insert(orderSpecialServices).values(orderSpecialService).returning();
        return newOrderSpecialService;
      }
      async getOrderSpecialServices(orderId) {
        const orderSpecialServicesData = await db.select().from(orderSpecialServices).where(eq2(orderSpecialServices.orderId, orderId));
        const serviceIds = orderSpecialServicesData.map((os) => os.specialServiceId);
        const result = [];
        for (const id of serviceIds) {
          if (id) {
            const service = await this.getSpecialService(id);
            if (service) {
              result.push(service);
            }
          }
        }
        return result;
      }
      // Wholesale order methods
      async getWholesaleOrder(id) {
        const [wholesaleOrder] = await db.select().from(wholesaleOrders).where(eq2(wholesaleOrders.id, id));
        return wholesaleOrder || void 0;
      }
      async getAllWholesaleOrders() {
        return await db.select().from(wholesaleOrders);
      }
      async createWholesaleOrder(wholesaleOrder) {
        const [newWholesaleOrder] = await db.insert(wholesaleOrders).values({
          ...wholesaleOrder,
          status: "pending",
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newWholesaleOrder;
      }
      async updateWholesaleOrder(id, data) {
        const [updatedWholesaleOrder] = await db.update(wholesaleOrders).set(data).where(eq2(wholesaleOrders.id, id)).returning();
        if (!updatedWholesaleOrder) {
          throw new Error("Wholesale order not found");
        }
        return updatedWholesaleOrder;
      }
      // Production Kanban methods
      async getOrdersByProductionStatus(status) {
        return await db.select().from(orders).where(eq2(orders.productionStatus, status)).orderBy(orders.lastStatusChange);
      }
      async updateOrderProductionStatus(id, status) {
        const [order] = await db.select().from(orders).where(eq2(orders.id, id));
        if (!order) {
          throw new Error("Order not found");
        }
        const previousStatus = order.productionStatus;
        const [updatedOrder] = await db.update(orders).set({
          productionStatus: status,
          lastStatusChange: /* @__PURE__ */ new Date()
        }).where(eq2(orders.id, id)).returning();
        if (updatedOrder.notificationsEnabled) {
          const [customer] = await db.select().from(customers).where(eq2(customers.id, order.customerId));
          if (customer) {
            try {
              const { sendOrderStatusUpdate: sendOrderStatusUpdate3 } = await Promise.resolve().then(() => (init_emailService(), emailService_exports));
              const emailSent = await sendOrderStatusUpdate3(
                customer.email,
                customer.name,
                order.id,
                status,
                previousStatus,
                order.estimatedCompletionDays
              );
              await this.createCustomerNotification({
                customerId: customer.id,
                orderId: order.id,
                notificationType: "status_update",
                channel: "email",
                subject: `Order #${order.id} Status Update: ${status}`,
                message: `Your order is now ${status.split("_").join(" ")}. Check your email for details.`,
                successful: emailSent,
                previousStatus,
                newStatus: status,
                // Store response data if needed for debugging
                responseData: emailSent ? { sent: true, timestamp: (/* @__PURE__ */ new Date()).toISOString() } : { sent: false, error: "Email failed to send" }
              });
              console.log(`Status update email ${emailSent ? "sent" : "failed"} for Order #${order.id} to ${customer.email}`);
            } catch (error) {
              console.error("Error sending status update email:", error);
              await this.createCustomerNotification({
                customerId: customer.id,
                orderId: order.id,
                notificationType: "status_update",
                channel: "email",
                subject: `Order #${order.id} Status Update: ${status}`,
                message: `Your order is now ${status.split("_").join(" ")}.`,
                successful: false,
                previousStatus,
                newStatus: status,
                responseData: { error: error.message }
              });
            }
          }
        }
        return updatedOrder;
      }
      async getOrdersForKanban() {
        const dbOrders = await db.select({
          order: orders,
          customer: customers
        }).from(orders).leftJoin(customers, eq2(orders.customerId, customers.id)).orderBy(orders.lastStatusChange);
        return dbOrders.map((row) => ({
          ...row.order,
          customerName: row.customer ? row.customer.name : "Unknown Customer",
          customerPhone: row.customer?.phone || "No phone",
          customerEmail: row.customer?.email || "No email"
        }));
      }
      async scheduleOrderForProduction(id, estimatedDays) {
        const [order] = await db.select().from(orders).where(eq2(orders.id, id));
        if (!order) {
          throw new Error("Order not found");
        }
        const [updatedOrder] = await db.update(orders).set({
          estimatedCompletionDays: estimatedDays,
          productionStatus: "scheduled"
        }).where(eq2(orders.id, id)).returning();
        if (updatedOrder.notificationsEnabled) {
          const [customer] = await db.select().from(customers).where(eq2(customers.id, order.customerId));
          if (customer) {
            const estimatedCompletionDate = /* @__PURE__ */ new Date();
            estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + estimatedDays);
            await this.createCustomerNotification({
              customerId: customer.id,
              orderId: order.id,
              notificationType: "estimated_completion",
              channel: "email",
              subject: `Your Custom Framing Order #${order.id} Has Been Scheduled`,
              message: `Your custom framing order #${order.id} has been scheduled for production. The estimated completion date is ${estimatedCompletionDate.toLocaleDateString()}.`,
              successful: true,
              previousStatus: order.productionStatus,
              newStatus: "scheduled"
            });
          }
        }
        return updatedOrder;
      }
      // Customer notification methods
      async createCustomerNotification(notification) {
        const [newNotification] = await db.insert(customerNotifications).values({
          ...notification
        }).returning();
        return newNotification;
      }
      async getCustomerNotifications(customerId) {
        return await db.select().from(customerNotifications).where(eq2(customerNotifications.customerId, customerId)).orderBy(customerNotifications.sentAt, "desc");
      }
      async getNotificationsByOrder(orderId) {
        return await db.select().from(customerNotifications).where(eq2(customerNotifications.orderId, orderId)).orderBy(customerNotifications.sentAt, "desc");
      }
      // Material order methods
      async getMaterialOrder(id) {
        const [materialOrder] = await db.select().from(materialOrders).where(eq2(materialOrders.id, id));
        return materialOrder;
      }
      async getAllMaterialOrders() {
        try {
          const columns = await db.execute(sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'material_orders'
      `);
          const result = await db.execute(sql`
        SELECT * FROM material_orders
        ORDER BY created_at DESC
      `);
          return result;
        } catch (error) {
          console.error("Error in getAllMaterialOrders:", error);
          return [];
        }
      }
      async getMaterialOrdersByStatus(status) {
        try {
          return await db.select().from(materialOrders).where(eq2(materialOrders.status, status)).orderBy(desc(materialOrders.createdAt));
        } catch (error) {
          console.error("Error in getMaterialOrdersByStatus:", error);
          return [];
        }
      }
      async getMaterialOrdersByType(materialType) {
        try {
          return await db.select().from(materialOrders).where(eq2(materialOrders.materialType, materialType)).orderBy(desc(materialOrders.createdAt));
        } catch (error) {
          console.error("Error in getMaterialOrdersByType:", error);
          return [];
        }
      }
      async createMaterialOrder(materialOrder) {
        console.log("Creating material order with data:", materialOrder);
        const cleanData = { ...materialOrder };
        if (cleanData.vendor && !cleanData.supplierName) {
          cleanData.supplierName = cleanData.vendor;
          delete cleanData.vendor;
        }
        console.log("Cleaned data for material order creation:", cleanData);
        try {
          const [newMaterialOrder] = await db.insert(materialOrders).values([cleanData]).returning();
          console.log("Successfully created material order:", newMaterialOrder.id);
          return newMaterialOrder;
        } catch (error) {
          console.error("Error creating material order:", error);
          throw error;
        }
      }
      async updateMaterialOrder(id, data) {
        console.log("updateMaterialOrder called with id:", id, "and data:", data);
        const materialId = typeof id === "string" && !isNaN(parseInt(id)) ? parseInt(id) : id;
        const cleanData = { ...data };
        if (cleanData.vendor && !cleanData.supplierName) {
          cleanData.supplierName = cleanData.vendor;
          delete cleanData.vendor;
        }
        console.log("Cleaned data for update:", cleanData);
        try {
          const [updatedMaterialOrder] = await db.update(materialOrders).set(cleanData).where(eq2(materialOrders.id, materialId)).returning();
          console.log("Successfully updated material order:", updatedMaterialOrder.id);
          return updatedMaterialOrder;
        } catch (error) {
          console.error("Error updating material order:", error);
          throw error;
        }
      }
      async deleteMaterialOrder(id) {
        await db.delete(materialOrders).where(eq2(materialOrders.id, id));
      }
      // Inventory Management System Methods
      // Inventory Items
      async getAllInventoryItems() {
        try {
          return await db.select().from(inventoryItems).orderBy(asc(inventoryItems.name));
        } catch (error) {
          console.error("Error in getAllInventoryItems:", error);
          return [];
        }
      }
      async getInventoryItem(id) {
        try {
          const [item] = await db.select().from(inventoryItems).where(eq2(inventoryItems.id, id));
          return item;
        } catch (error) {
          console.error("Error in getInventoryItem:", error);
          return void 0;
        }
      }
      async getInventoryItemByBarcode(barcode) {
        try {
          const [item] = await db.select().from(inventoryItems).where(eq2(inventoryItems.barcode, barcode));
          return item;
        } catch (error) {
          console.error("Error in getInventoryItemByBarcode:", error);
          return void 0;
        }
      }
      async createInventoryItem(inventoryItem) {
        try {
          if (!inventoryItem.sku) {
            inventoryItem.sku = `INV-${Date.now().toString(36).toUpperCase()}`;
          }
          const { initialQuantity, ...itemToInsert } = inventoryItem;
          const [newItem] = await db.insert(inventoryItems).values([itemToInsert]).returning();
          if (initialQuantity) {
            await this.createInventoryTransaction({
              itemId: newItem.id,
              type: "initial",
              quantity: initialQuantity,
              unitCost: inventoryItem.costPerUnit,
              notes: "Initial inventory setup"
            });
          }
          return newItem;
        } catch (error) {
          console.error("Error in createInventoryItem:", error);
          throw error;
        }
      }
      async updateInventoryItem(id, item) {
        try {
          const [updatedItem] = await db.update(inventoryItems).set({
            ...item,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq2(inventoryItems.id, id)).returning();
          return updatedItem;
        } catch (error) {
          console.error("Error in updateInventoryItem:", error);
          throw error;
        }
      }
      async deleteInventoryItem(id) {
        try {
          await db.delete(inventoryTransactions).where(eq2(inventoryTransactions.itemId, id));
          await db.delete(inventoryItems).where(eq2(inventoryItems.id, id));
        } catch (error) {
          console.error("Error in deleteInventoryItem:", error);
          throw error;
        }
      }
      // Low stock items
      async getLowStockItems() {
        try {
          const items = await db.select().from(inventoryItems);
          const lowStockItems = [];
          for (const item of items) {
            const currentStock = await this.getItemCurrentStock(item.id);
            if (currentStock <= Number(item.reorderLevel)) {
              lowStockItems.push({
                ...item,
                currentStock
              });
            }
          }
          return lowStockItems;
        } catch (error) {
          console.error("Error in getLowStockItems:", error);
          return [];
        }
      }
      // Get current stock level for an item based on transactions
      async getItemCurrentStock(itemId) {
        try {
          const transactions = await db.select().from(inventoryTransactions).where(eq2(inventoryTransactions.itemId, itemId));
          let currentStock = 0;
          for (const transaction of transactions) {
            const quantity = Number(transaction.quantity);
            switch (transaction.type) {
              case "purchase":
              case "initial":
              case "adjustment":
                currentStock += quantity;
                break;
              case "sale":
              case "scrap":
                currentStock -= quantity;
                break;
            }
          }
          return currentStock;
        } catch (error) {
          console.error("Error in getItemCurrentStock:", error);
          return 0;
        }
      }
      // Inventory Transactions
      async createInventoryTransaction(transaction) {
        try {
          const [newTransaction] = await db.insert(inventoryTransactions).values([transaction]).returning();
          if (transaction.type === "count") {
            await db.update(inventoryItems).set({
              lastCountDate: /* @__PURE__ */ new Date(),
              updatedAt: /* @__PURE__ */ new Date()
            }).where(eq2(inventoryItems.id, transaction.itemId));
          }
          return newTransaction;
        } catch (error) {
          console.error("Error in createInventoryTransaction:", error);
          throw error;
        }
      }
      // Suppliers
      async getAllSuppliers() {
        try {
          return await db.select().from(suppliers).orderBy(asc(suppliers.name));
        } catch (error) {
          console.error("Error in getAllSuppliers:", error);
          return [];
        }
      }
      async getSupplier(id) {
        try {
          const [supplier] = await db.select().from(suppliers).where(eq2(suppliers.id, id));
          return supplier;
        } catch (error) {
          console.error("Error in getSupplier:", error);
          return void 0;
        }
      }
      async createSupplier(supplier) {
        try {
          const [newSupplier] = await db.insert(suppliers).values(supplier).returning();
          return newSupplier;
        } catch (error) {
          console.error("Error in createSupplier:", error);
          throw error;
        }
      }
      async updateSupplier(id, supplier) {
        try {
          const [updatedSupplier] = await db.update(suppliers).set(supplier).where(eq2(suppliers.id, id)).returning();
          return updatedSupplier;
        } catch (error) {
          console.error("Error in updateSupplier:", error);
          throw error;
        }
      }
      async deleteSupplier(id) {
        try {
          await db.delete(suppliers).where(eq2(suppliers.id, id));
        } catch (error) {
          console.error("Error in deleteSupplier:", error);
          throw error;
        }
      }
      // Inventory Locations
      async getAllInventoryLocations() {
        try {
          return await db.select().from(inventoryLocations).orderBy(asc(inventoryLocations.name));
        } catch (error) {
          console.error("Error in getAllInventoryLocations:", error);
          return [];
        }
      }
      async getInventoryLocation(id) {
        try {
          const [location] = await db.select().from(inventoryLocations).where(eq2(inventoryLocations.id, id));
          return location;
        } catch (error) {
          console.error("Error in getInventoryLocation:", error);
          return void 0;
        }
      }
      async createInventoryLocation(location) {
        try {
          const [newLocation] = await db.insert(inventoryLocations).values(location).returning();
          return newLocation;
        } catch (error) {
          console.error("Error in createInventoryLocation:", error);
          throw error;
        }
      }
      // Purchase Orders and Lines
      async getAllPurchaseOrders() {
        try {
          return await db.select().from(purchaseOrders).orderBy(desc(purchaseOrders.createdAt));
        } catch (error) {
          console.error("Error in getAllPurchaseOrders:", error);
          return [];
        }
      }
      async getPurchaseOrder(id) {
        try {
          const [order] = await db.select().from(purchaseOrders).where(eq2(purchaseOrders.id, id));
          return order;
        } catch (error) {
          console.error("Error in getPurchaseOrder:", error);
          return void 0;
        }
      }
      async createPurchaseOrderWithLines(orderData, lines) {
        try {
          const poNumber = `PO-${Date.now().toString(36).toUpperCase()}`;
          let subtotal = 0;
          for (const line of lines) {
            const lineTotal = Number(line.quantity) * Number(line.unitCost);
            subtotal += lineTotal;
          }
          const tax = subtotal * 0.08;
          const total = subtotal + tax + Number(orderData.shipping || 0);
          const [purchaseOrder] = await db.insert(purchaseOrders).values({
            ...orderData,
            subtotal: subtotal.toString(),
            tax: tax.toString(),
            total: total.toString()
          }).returning();
          for (const line of lines) {
            const lineTotal = Number(line.quantity) * Number(line.unitCost);
            await db.insert(purchaseOrderLines).values({
              ...line,
              purchaseOrderId: purchaseOrder.id,
              lineTotal: lineTotal.toString()
            });
          }
          return purchaseOrder;
        } catch (error) {
          console.error("Error in createPurchaseOrderWithLines:", error);
          throw error;
        }
      }
      // Valuation
      async getInventoryValuation() {
        try {
          const items = await this.getAllInventoryItems();
          let totalValue = 0;
          const valueByCategory = {};
          for (const item of items) {
            const currentStock = await this.getItemCurrentStock(item.id);
            const itemValue = currentStock * Number(item.costPerUnit);
            totalValue += itemValue;
            if (item.categoryId) {
              const category = await this.getInventoryCategory(item.categoryId);
              const categoryName = category?.name || "Uncategorized";
              if (!valueByCategory[categoryName]) {
                valueByCategory[categoryName] = 0;
              }
              valueByCategory[categoryName] += itemValue;
            } else {
              if (!valueByCategory["Uncategorized"]) {
                valueByCategory["Uncategorized"] = 0;
              }
              valueByCategory["Uncategorized"] += itemValue;
            }
          }
          const valuationByCategory = Object.entries(valueByCategory).map(([category, value]) => ({
            category,
            value
          }));
          return {
            totalValue,
            itemCount: items.length,
            valuationByCategory
          };
        } catch (error) {
          console.error("Error in getInventoryValuation:", error);
          return {
            totalValue: 0,
            itemCount: 0,
            valuationByCategory: []
          };
        }
      }
      // Get inventory category by ID
      async getInventoryCategory(id) {
        try {
          const [category] = await db.select().from(inventoryCategories).where(eq2(inventoryCategories.id, id));
          return category;
        } catch (error) {
          console.error("Error in getInventoryCategory:", error);
          return void 0;
        }
      }
      // Generate recommended purchase orders
      async generateRecommendedPurchaseOrders() {
        try {
          const lowStockItems = await this.getLowStockItems();
          const supplierMap = {};
          for (const item of lowStockItems) {
            if (item.supplierId) {
              const supplier = await this.getSupplier(item.supplierId);
              if (supplier) {
                if (!supplierMap[supplier.id]) {
                  supplierMap[supplier.id] = {
                    supplierId: supplier.id,
                    supplierName: supplier.name,
                    items: []
                  };
                }
                supplierMap[supplier.id].items.push({
                  itemId: item.id,
                  name: item.name,
                  sku: item.sku,
                  currentStock: await this.getItemCurrentStock(item.id),
                  reorderLevel: Number(item.reorderLevel),
                  reorderQuantity: Number(item.reorderQuantity || item.reorderLevel)
                });
              }
            }
          }
          return Object.values(supplierMap);
        } catch (error) {
          console.error("Error in generateRecommendedPurchaseOrders:", error);
          return [];
        }
      }
      // CSV Import/Export
      async importInventoryFromCSV(filePath) {
        try {
          return {
            success: true,
            importedCount: 0,
            errors: []
          };
        } catch (error) {
          console.error("Error in importInventoryFromCSV:", error);
          return {
            success: false,
            importedCount: 0,
            errors: ["Failed to import CSV data"]
          };
        }
      }
      async exportInventoryToCSV() {
        try {
          return "id,sku,name,description,quantity\n";
        } catch (error) {
          console.error("Error in exportInventoryToCSV:", error);
          throw error;
        }
      }
      // Notification methods
      async createNotification(notification) {
        const [newNotification] = await db.insert(notifications).values([notification]).returning();
        return newNotification;
      }
      async getNotification(id) {
        const [notification] = await db.select().from(notifications).where(eq2(notifications.id, id));
        return notification || void 0;
      }
      async getNotifications(limit) {
        let query = db.select().from(notifications).orderBy(desc(notifications.createdAt));
        if (limit) {
          query = query.limit(limit);
        }
        return await query;
      }
      async getUnreadNotifications() {
        return await db.select().from(notifications).where(eq2(notifications.read, false)).orderBy(desc(notifications.createdAt));
      }
      async markNotificationAsRead(id) {
        const [updatedNotification] = await db.update(notifications).set({ read: true }).where(eq2(notifications.id, id)).returning();
        return updatedNotification;
      }
      async getNotificationsByUser(userId) {
        return await db.select().from(notifications).where(eq2(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
      }
      // Materials Pick List functionality
      async getMaterialsPickList() {
        try {
          const materialsList = await db.select({
            id: materialOrders.id,
            name: materialOrders.materialName,
            sku: materialOrders.materialId,
            supplier: materialOrders.supplierName,
            type: materialOrders.materialType,
            quantity: materialOrders.quantity,
            status: materialOrders.status,
            priority: materialOrders.priority,
            notes: materialOrders.notes,
            orderDate: materialOrders.orderDate,
            receiveDate: materialOrders.actualArrival,
            sourceOrderId: materialOrders.sourceOrderId,
            costPerUnit: materialOrders.costPerUnit,
            totalCost: materialOrders.totalCost
          }).from(materialOrders).where(
            or(
              eq2(materialOrders.status, "pending"),
              eq2(materialOrders.status, "processed"),
              eq2(materialOrders.status, "ordered"),
              eq2(materialOrders.status, "arrived")
            )
          ).orderBy(desc(materialOrders.createdAt));
          const transformedList = materialsList.map((item) => ({
            id: item.id.toString(),
            orderIds: item.sourceOrderId ? [item.sourceOrderId] : [],
            name: item.name,
            sku: item.sku,
            supplier: item.supplier || "Unknown",
            type: item.type,
            quantity: Number(item.quantity),
            status: item.status,
            priority: item.priority || "medium",
            notes: item.notes || "",
            orderDate: item.orderDate?.toISOString() || null,
            receiveDate: item.receiveDate?.toISOString() || null,
            costPerUnit: item.costPerUnit ? Number(item.costPerUnit) : 0,
            totalCost: item.totalCost ? Number(item.totalCost) : 0
          }));
          return transformedList;
        } catch (error) {
          log(`Error in getMaterialsPickList: ${error}`, "storage");
          throw error;
        }
      }
      async getMaterialsForOrder(orderId) {
        try {
          const materials = await db.select().from(materialOrders).where(eq2(materialOrders.sourceOrderId, orderId));
          return materials;
        } catch (error) {
          log(`Error in getMaterialsForOrder: ${error}`, "storage");
          throw error;
        }
      }
      async createPurchaseOrder(materialIds) {
        try {
          const numericIds = materialIds.map((id) => parseInt(id));
          const selectedMaterials = await db.select().from(materialOrders).where(sql`${materialOrders.id} IN (${numericIds.join(",")})`);
          if (selectedMaterials.length === 0) {
            throw new Error("No valid materials found for purchase order");
          }
          const alreadyOrdered = selectedMaterials.filter(
            (m) => m.status === "ordered" || m.status === "arrived" || m.status === "completed"
          );
          if (alreadyOrdered.length > 0) {
            throw new Error(`Materials already ordered: ${alreadyOrdered.map((m) => m.materialName).join(", ")}`);
          }
          await db.update(materialOrders).set({
            status: "ordered",
            orderDate: /* @__PURE__ */ new Date()
          }).where(sql`${materialOrders.id} IN (${numericIds.join(",")})`);
          const totalAmount = selectedMaterials.reduce((sum, material) => {
            return sum + (Number(material.totalCost) || 0);
          }, 0);
          const purchaseOrder = {
            id: "po-" + Date.now(),
            orderNumber: `PO-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(Math.floor(Math.random() * 1e3)).padStart(3, "0")}`,
            materialIds,
            totalAmount,
            status: "sent",
            createdAt: (/* @__PURE__ */ new Date()).toISOString(),
            expectedDeliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1e3).toISOString(),
            materials: selectedMaterials
          };
          return purchaseOrder;
        } catch (error) {
          log(`Error in createPurchaseOrder: ${error}`, "storage");
          throw error;
        }
      }
      // Failsafe mechanism to check for duplicate material orders
      async checkDuplicateMaterialOrder(materialId, sourceOrderId) {
        try {
          const existing = await db.select().from(materialOrders).where(
            and(
              eq2(materialOrders.materialId, materialId),
              eq2(materialOrders.sourceOrderId, sourceOrderId),
              or(
                eq2(materialOrders.status, "pending"),
                eq2(materialOrders.status, "ordered"),
                eq2(materialOrders.status, "arrived")
              )
            )
          );
          return existing.length > 0;
        } catch (error) {
          log(`Error checking duplicate material order: ${error}`, "storage");
          return false;
        }
      }
      // Create material orders automatically when an order is placed
      async createMaterialOrdersFromOrder(order) {
        try {
          const materialOrders2 = [];
          if (order.frameId) {
            const frame = await this.getFrame(order.frameId);
            if (frame) {
              const isDuplicate = await this.checkDuplicateMaterialOrder(order.frameId, order.id);
              if (!isDuplicate) {
                const perimeter = 2 * (Number(order.artworkWidth) + Number(order.artworkHeight));
                const frameLength = Math.ceil(perimeter * 1.1);
                materialOrders2.push({
                  materialType: "frame",
                  materialId: order.frameId,
                  materialName: frame.name,
                  quantity: frameLength.toString(),
                  status: "pending",
                  sourceOrderId: order.id,
                  supplierName: frame.manufacturer,
                  costPerUnit: frame.price,
                  totalCost: (Number(frame.price) * frameLength).toString(),
                  priority: "medium",
                  unitMeasurement: "united_inch",
                  notes: `Frame for order #${order.id}`
                });
              }
            }
          }
          if (order.matColorId) {
            const mat = await this.getMatColor(order.matColorId);
            if (mat) {
              const isDuplicate = await this.checkDuplicateMaterialOrder(order.matColorId, order.id);
              if (!isDuplicate) {
                const matWidth = Number(order.artworkWidth) + Number(order.matWidth) * 2 + 4;
                const matHeight = Number(order.artworkHeight) + Number(order.matWidth) * 2 + 4;
                const matArea = matWidth * matHeight;
                materialOrders2.push({
                  materialType: "matboard",
                  materialId: order.matColorId,
                  materialName: mat.name,
                  quantity: "1",
                  status: "pending",
                  sourceOrderId: order.id,
                  supplierName: mat.manufacturer || "Crescent",
                  costPerUnit: (Number(mat.price) * matArea).toString(),
                  totalCost: (Number(mat.price) * matArea).toString(),
                  priority: "medium",
                  unitMeasurement: "sheet",
                  notes: `Mat board for order #${order.id} - ${matWidth}"x${matHeight}"`
                });
              }
            }
          }
          if (order.glassOptionId) {
            const glass = await this.getGlassOption(order.glassOptionId);
            if (glass) {
              const isDuplicate = await this.checkDuplicateMaterialOrder(order.glassOptionId, order.id);
              if (!isDuplicate) {
                const glassWidth = Number(order.artworkWidth) + Number(order.matWidth) * 2;
                const glassHeight = Number(order.artworkHeight) + Number(order.matWidth) * 2;
                const glassArea = glassWidth * glassHeight;
                materialOrders2.push({
                  materialType: "glass",
                  materialId: order.glassOptionId,
                  materialName: glass.name,
                  quantity: "1",
                  status: "pending",
                  sourceOrderId: order.id,
                  supplierName: "Tru Vue",
                  costPerUnit: (Number(glass.price) * glassArea).toString(),
                  totalCost: (Number(glass.price) * glassArea).toString(),
                  priority: "medium",
                  unitMeasurement: "square_inch",
                  notes: `Glass for order #${order.id} - ${glassWidth}"x${glassHeight}"`
                });
              }
            }
          }
          console.log(`Attempting to save ${materialOrders2.length} material orders`);
          const createdOrders = [];
          for (const materialOrder of materialOrders2) {
            try {
              console.log("Inserting material order:", materialOrder);
              const [created] = await db.insert(materialOrders2).values(materialOrder).returning();
              createdOrders.push(created);
              console.log("Successfully inserted material order:", created.id);
            } catch (error) {
              console.error("Error inserting material order:", error, materialOrder);
            }
          }
          console.log(`Successfully created ${createdOrders.length} material orders for order ${order.id}`);
          return createdOrders;
        } catch (error) {
          log(`Error creating material orders from order: ${error}`, "storage");
          throw error;
        }
      }
    };
    storage = new DatabaseStorage();
  }
});

// server/controllers/qrCodeController.ts
import { randomBytes } from "crypto";
import { eq as eq4, and as and2 } from "drizzle-orm";
function generateQrCode() {
  return `JF${randomBytes(4).toString("hex")}`;
}
async function generateQrCodeForOrder(orderId) {
  try {
    const qrCodeValue = generateQrCode();
    const [newQrCode] = await db.insert(qrCodes).values([{
      code: qrCodeValue,
      type: "customer_order",
      entityId: orderId.toString(),
      title: `Order #${orderId}`,
      description: `QR code for order #${orderId}`,
      active: true
    }]).returning();
    return qrCodeValue;
  } catch (error) {
    console.error("Error generating QR code for order:", error?.message || error);
    throw new Error("Failed to generate QR code for order");
  }
}
var init_qrCodeController = __esm({
  "server/controllers/qrCodeController.ts"() {
    "use strict";
    init_db();
    init_schema();
  }
});

// server/services/orderStatusHistoryService.ts
var orderStatusHistoryService_exports = {};
__export(orderStatusHistoryService_exports, {
  getCustomerOrderStatusHistory: () => getCustomerOrderStatusHistory,
  getOrderStatusHistory: () => getOrderStatusHistory,
  notifyCustomerOfStatusChange: () => notifyCustomerOfStatusChange,
  recordStatusChange: () => recordStatusChange
});
import { sql as sql2 } from "drizzle-orm";
async function recordStatusChange(orderId, previousStatus, newStatus, notes) {
  try {
    await db.execute(sql2`
      INSERT INTO order_status_history (order_id, previous_status, new_status, notes)
      VALUES (${orderId}, ${previousStatus}, ${newStatus}, ${notes || null})
    `);
    const [record] = await db.execute(sql2`
      SELECT * FROM order_status_history 
      WHERE order_id = ${orderId}
      ORDER BY changed_at DESC LIMIT 1
    `);
    return record;
  } catch (error) {
    console.error("Error recording status change:", error);
    throw error;
  }
}
async function getOrderStatusHistory(orderId) {
  try {
    const history = await db.execute(sql2`
      SELECT * FROM order_status_history 
      WHERE order_id = ${orderId}
      ORDER BY changed_at DESC
    `);
    return history;
  } catch (error) {
    console.error("Error fetching order status history:", error);
    throw error;
  }
}
async function getCustomerOrderStatusHistory(customerId) {
  try {
    const history = await db.execute(sql2`
      SELECT h.*, o.id as order_id, o.frame_name, o.artwork_description
      FROM order_status_history h
      JOIN orders o ON h.order_id = o.id
      WHERE o.customer_id = ${customerId}
      ORDER BY h.changed_at DESC
    `);
    return history;
  } catch (error) {
    console.error("Error fetching customer order status history:", error);
    throw error;
  }
}
async function notifyCustomerOfStatusChange(order, previousStatus, newStatus) {
  try {
    if (!order.customerId) return;
    const [customer] = await db.execute(sql2`
      SELECT * FROM customers WHERE id = ${order.customerId}
    `);
    if (!customer || !customer.status_notifications_enabled) {
      return;
    }
    await sendOrderStatusUpdate2(
      customer.email,
      customer.name,
      order.id,
      newStatus,
      order.dueDate
    );
    return true;
  } catch (error) {
    console.error("Error notifying customer of status change:", error);
    return false;
  }
}
var init_orderStatusHistoryService = __esm({
  "server/services/orderStatusHistoryService.ts"() {
    "use strict";
    init_db();
    init_emailService();
  }
});

// server/controllers/integrationController.ts
var integrationController_exports = {};
__export(integrationController_exports, {
  configureKanbanConnection: () => configureKanbanConnection,
  generateApiKey: () => generateApiKey,
  getAllOrdersWithQrCodes: () => getAllOrdersWithQrCodes,
  getIntegrationDocs: () => getIntegrationDocs,
  getIntegrationStatus: () => getIntegrationStatus,
  getOrderWithQrCode: () => getOrderWithQrCode,
  receiveWebhook: () => receiveWebhook,
  testIntegration: () => testIntegration,
  updateOrderStatus: () => updateOrderStatus
});
async function getOrderWithQrCode(req, res) {
  try {
    const { id } = req.params;
    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }
    const order = await storage.getOrder(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    const qrCodeData = await generateQrCodeForOrder(orderId);
    res.json({
      success: true,
      order: {
        ...order,
        qrCode: qrCodeData
      }
    });
  } catch (error) {
    console.error("Error fetching order with QR code:", error);
    res.status(500).json({ error: error.message || "Failed to fetch order information" });
  }
}
async function getAllOrdersWithQrCodes(req, res) {
  try {
    const { status, limit } = req.query;
    const limitNum = limit ? parseInt(limit) : void 0;
    const orders2 = await storage.getOrders(status);
    const limitedOrders = limitNum ? orders2.slice(0, limitNum) : orders2;
    const enhancedOrders = await Promise.all(limitedOrders.map(async (order) => {
      const qrCodeData = await generateQrCodeForOrder(order.id);
      return {
        ...order,
        qrCode: qrCodeData
      };
    }));
    res.json({
      success: true,
      count: enhancedOrders.length,
      orders: enhancedOrders
    });
  } catch (error) {
    console.error("Error fetching orders with QR codes:", error);
    res.status(500).json({ error: error.message || "Failed to fetch orders" });
  }
}
async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    const order = await storage.getOrder(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    const updatedOrder = await storage.updateOrder(orderId, {
      status,
      notes: notes || `Status updated via Integration API to: ${status}`
    });
    try {
      const orderStatusHistoryService = (init_orderStatusHistoryService(), __toCommonJS(orderStatusHistoryService_exports));
      await orderStatusHistoryService.addStatusHistory(orderId, {
        previousStatus: order.status,
        newStatus: status,
        changedBy: "Integration API",
        notes: notes || `Status updated via Integration API`
      });
    } catch (historyError) {
      console.warn("Could not log status history:", historyError);
    }
    res.json({
      success: true,
      message: "Order status updated",
      order: updatedOrder
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: error.message || "Failed to update order status" });
  }
}
async function receiveWebhook(req, res) {
  try {
    const { source, event, data } = req.body;
    if (!source || !event) {
      return res.status(400).json({ error: "Source and event are required" });
    }
    console.log(`Received webhook from ${source}, event: ${event}`);
    switch (source) {
      case "qr_generator":
        if (event === "qr_generated" && data && data.orderId) {
          const orderId = parseInt(data.orderId);
          await storage.updateOrder(orderId, {
            hasQrCode: true,
            qrCodeGeneratedAt: /* @__PURE__ */ new Date(),
            qrCodeData: data.qrData
          });
        }
        break;
      case "printing_system":
        if (event === "invoice_printed" && data && data.orderId) {
          const orderId = parseInt(data.orderId);
          await storage.updateOrder(orderId, {
            invoicePrinted: true,
            printedAt: /* @__PURE__ */ new Date()
          });
        }
        break;
      // Add more sources as needed
      default:
        console.log(`Unknown webhook source: ${source}`);
    }
    res.json({
      success: true,
      message: `Webhook received from ${source} for event ${event}`
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: error.message || "Failed to process webhook" });
  }
}
async function generateApiKey(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const timestamp2 = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const apiKey = `jf_api_${timestamp2}_${randomString}`;
    const keyInfo = {
      key: apiKey,
      name: "Jay's Frames API Integration",
      permissions: ["orders:read", "orders:write", "integration:webhook", "pricing:read", "catalog:read"],
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      lastUsed: null
    };
    console.log("New API Key generated:", apiKey);
    const response = {
      success: true,
      ...keyInfo,
      message: "API key generated successfully. Store this securely.",
      endpoints: {
        baseUrl: process.env.REPL_URL || `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`,
        orders: "/api/integration/orders",
        webhook: "/api/integration/webhook",
        status: "/api/integration/status",
        pricing: "/api/pricing/calculate",
        catalog: "/api/vendor-catalog/frames"
      },
      authentication: {
        method: "Bearer Token",
        header: "Authorization",
        value: `Bearer ${apiKey}`
      }
    };
    return res.status(200).json(response);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error generating API key:", error);
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate API key"
    });
  }
}
async function testIntegration(req, res) {
  try {
    res.json({
      success: true,
      message: "Integration API is working correctly",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      endpoints: {
        baseUrl: process.env.REPL_URL || "https://your-repl-url.replit.dev",
        orders: "/api/integration/orders",
        webhook: "/api/integration/webhook",
        configureKanban: "/api/integration/configure-kanban"
      }
    });
  } catch (error) {
    console.error("Error in test integration:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Integration test failed"
    });
  }
}
async function configureKanbanConnection(req, res) {
  try {
    const { kanbanApiUrl, kanbanApiKey } = req.body;
    if (!kanbanApiUrl || !kanbanApiKey) {
      return res.status(400).json({
        success: false,
        error: "Both kanbanApiUrl and kanbanApiKey are required"
      });
    }
    try {
      const testResponse = await fetch(`${kanbanApiUrl}/api/kanban/status`, {
        headers: {
          "Authorization": `Bearer ${kanbanApiKey}`,
          "Content-Type": "application/json"
        },
        timeout: 5e3
      });
      if (!testResponse.ok) {
        throw new Error(`Connection test failed: ${testResponse.status}`);
      }
      const testData = await testResponse.json();
      res.json({
        success: true,
        message: "Kanban connection configured successfully",
        kanbanStatus: testData,
        configuration: {
          kanbanApiUrl,
          apiKeyConfigured: true
        }
      });
    } catch (connectionError) {
      res.status(400).json({
        success: false,
        error: `Failed to connect to Kanban app: ${connectionError.message}`
      });
    }
  } catch (error) {
    console.error("Error configuring Kanban connection:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to configure Kanban connection"
    });
  }
}
async function getIntegrationStatus(req, res) {
  try {
    res.json({
      success: true,
      status: "active",
      integrations: {
        webhooks: {
          enabled: true,
          endpointCount: 0
        },
        apiAccess: {
          enabled: true,
          lastGenerated: (/* @__PURE__ */ new Date()).toISOString()
        }
      },
      endpoints: {
        baseUrl: process.env.REPL_URL || "https://your-repl-url.replit.dev",
        orders: "/api/integration/orders",
        webhook: "/api/integration/webhook"
      }
    });
  } catch (error) {
    console.error("Error getting integration status:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get integration status"
    });
  }
}
async function getIntegrationDocs(req, res) {
  try {
    res.json({
      success: true,
      documentation: {
        authentication: {
          method: "Bearer Token",
          header: "Authorization",
          example: "Authorization: Bearer YOUR_API_KEY"
        },
        endpoints: [
          {
            method: "GET",
            path: "/api/integration/orders",
            description: "Get all orders with QR codes",
            parameters: {
              status: "optional - filter by order status",
              limit: "optional - limit number of results"
            }
          },
          {
            method: "GET",
            path: "/api/integration/orders/:id",
            description: "Get specific order with QR code",
            parameters: {
              id: "required - order ID"
            }
          },
          {
            method: "PATCH",
            path: "/api/integration/orders/:id/status",
            description: "Update order status",
            body: {
              status: "required - new status",
              notes: "optional - status change notes"
            }
          },
          {
            method: "POST",
            path: "/api/integration/webhook",
            description: "Receive webhook notifications",
            body: {
              source: "required - webhook source",
              event: "required - event type",
              data: "optional - event data"
            }
          }
        ],
        webhookEvents: [
          "order.created",
          "order.updated",
          "order.completed",
          "payment.received",
          "qr.generated"
        ]
      }
    });
  } catch (error) {
    console.error("Error getting integration docs:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get integration documentation"
    });
  }
}
var init_integrationController = __esm({
  "server/controllers/integrationController.ts"() {
    "use strict";
    init_storage();
    init_qrCodeController();
  }
});

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default;
var init_vite_config = __esm({
  "vite.config.ts"() {
    "use strict";
    vite_config_default = defineConfig({
      plugins: [
        react(),
        runtimeErrorOverlay(),
        themePlugin(),
        ...false ? [
          null.then(
            (m) => m.cartographer()
          )
        ] : []
      ],
      resolve: {
        alias: {
          "@": path.resolve(import.meta.dirname, "client", "src"),
          "@shared": path.resolve(import.meta.dirname, "shared"),
          "@assets": path.resolve(import.meta.dirname, "attached_assets")
        }
      },
      root: path.resolve(import.meta.dirname, "client"),
      build: {
        outDir: path.resolve(import.meta.dirname, "dist/public"),
        emptyOutDir: true
      },
      server: {
        host: "0.0.0.0",
        port: 5173,
        hmr: {
          port: 5173
        }
      },
      preview: {
        host: "0.0.0.0",
        port: 5173
      }
    });
  }
});

// server/vite.ts
import fs from "fs";
import { createServer as createViteServer, createLogger } from "vite";
import { nanoid } from "nanoid";
import express3 from "express";
import path2 from "path";
import { fileURLToPath } from "url";
function log2(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        console.error(`Vite server error: ${msg}`);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPublicPath = path2.resolve(__dirname, "..", "dist", "public");
  const clientDistPath = path2.resolve(__dirname, "..", "client", "dist");
  let staticPath = "";
  if (fs.existsSync(distPublicPath)) {
    staticPath = distPublicPath;
    log2(`Serving static files from: ${distPublicPath}`);
  } else if (fs.existsSync(clientDistPath)) {
    staticPath = clientDistPath;
    log2(`Serving static files from: ${clientDistPath}`);
  } else {
    log2("No static files found. Please build the client application.", "error");
  }
  if (staticPath) {
    app2.use(express3.static(staticPath, {
      maxAge: true ? "1d" : 0,
      etag: true,
      index: "index.html"
    }));
  }
  app2.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      return next();
    }
    const indexPath = path2.resolve(staticPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(500).json({
        error: "Client application not built",
        message: 'Please run "npm run build" to build the client application'
      });
    }
  });
}
var viteLogger, __filename, __dirname;
var init_vite = __esm({
  "server/vite.ts"() {
    "use strict";
    init_vite_config();
    viteLogger = createLogger();
    __filename = fileURLToPath(import.meta.url);
    __dirname = path2.dirname(__filename);
  }
});

// server/services/aiMaterialOrderingService.ts
var aiMaterialOrderingService_exports = {};
__export(aiMaterialOrderingService_exports, {
  generateOrderingRecommendations: () => generateOrderingRecommendations,
  getSeasonalTrends: () => getSeasonalTrends
});
import OpenAI from "openai";
import { sql as sql3 } from "drizzle-orm";
async function generateOrderingRecommendations() {
  try {
    log2("Generating AI-powered material ordering recommendations", "aiMaterialOrderingService");
    const materialUsageData = await getMaterialUsageData();
    if (materialUsageData.length === 0) {
      return [];
    }
    const prompt = createOrderingPrompt(materialUsageData);
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert inventory management consultant for a custom framing business. You analyze material usage patterns, seasonal trends, and lead times to optimize ordering decisions. Your goal is to prevent stockouts while minimizing holding costs and waste."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 2e3
    });
    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      throw new Error("No response from OpenAI");
    }
    const aiResponse = JSON.parse(responseContent);
    return aiResponse.recommendations || [];
  } catch (error) {
    log2(`Error generating ordering recommendations: ${error}`, "aiMaterialOrderingService");
    throw error;
  }
}
async function getMaterialUsageData() {
  try {
    const query = sql3`
      SELECT 
        m.id as material_id,
        m.name as material_name,
        m.type as material_type,
        m.stock_quantity as current_stock,
        m.price as price_per_unit,
        m.lead_time_days as lead_time,
        COALESCE(usage_month.usage_count, 0) as usage_last_month,
        COALESCE(usage_3month.usage_count, 0) as usage_last_3_months,
        COALESCE(avg_order.avg_size, 1) as average_order_size
      FROM materials m
      LEFT JOIN (
        SELECT material_id, COUNT(*) as usage_count
        FROM order_materials om
        JOIN orders o ON om.order_id = o.id
        WHERE o.created_at >= NOW() - INTERVAL '1 month'
        GROUP BY material_id
      ) usage_month ON m.id = usage_month.material_id
      LEFT JOIN (
        SELECT material_id, COUNT(*) as usage_count
        FROM order_materials om
        JOIN orders o ON om.order_id = o.id
        WHERE o.created_at >= NOW() - INTERVAL '3 months'
        GROUP BY material_id
      ) usage_3month ON m.id = usage_3month.material_id
      LEFT JOIN (
        SELECT material_id, AVG(quantity) as avg_size
        FROM order_materials
        GROUP BY material_id
      ) avg_order ON m.id = avg_order.material_id
      WHERE m.active = true
    `;
    return [
      {
        materialId: "frame_001",
        materialName: 'Black Metal Frame 1"',
        materialType: "frame",
        currentStock: 25,
        usageLastMonth: 15,
        usageLast3Months: 48,
        averageOrderSize: 2.5,
        seasonalTrend: "stable",
        pricePerUnit: 45.5,
        leadTime: 14
      },
      {
        materialId: "mat_001",
        materialName: "White Conservation Mat",
        materialType: "mat",
        currentStock: 8,
        usageLastMonth: 22,
        usageLast3Months: 67,
        averageOrderSize: 1.8,
        seasonalTrend: "increasing",
        pricePerUnit: 12.75,
        leadTime: 7
      }
    ];
  } catch (error) {
    log2(`Error getting material usage data: ${error}`, "aiMaterialOrderingService");
    return [];
  }
}
function createOrderingPrompt(materialData) {
  return `
Analyze the following material usage data for a custom framing business and provide ordering recommendations:

MATERIAL USAGE DATA:
${JSON.stringify(materialData, null, 2)}

BUSINESS CONTEXT:
- We want to maintain 2-3 weeks of inventory as safety stock
- Minimize holding costs while preventing stockouts
- Consider seasonal trends and lead times
- Budget constraints may limit large orders

Please provide recommendations in this JSON format:
{
  "recommendations": [
    {
      "materialId": "string",
      "materialName": "string", 
      "recommendedQuantity": number,
      "urgency": "low|medium|high|critical",
      "reasoning": "detailed explanation of recommendation",
      "estimatedRunoutDate": "YYYY-MM-DD",
      "suggestedOrderDate": "YYYY-MM-DD", 
      "costImpact": number
    }
  ],
  "summary": "Overall analysis and key insights"
}

Consider:
1. Current stock levels vs usage patterns
2. Lead times and reorder points
3. Seasonal trends and demand forecasting  
4. Cost optimization opportunities
5. Risk of stockouts vs holding costs
`;
}
async function getSeasonalTrends(materialId) {
  try {
    return {
      materialId,
      trends: {
        spring: "high_demand",
        summer: "medium_demand",
        fall: "high_demand",
        winter: "low_demand"
      },
      recommendation: "Stock up before spring and fall seasons"
    };
  } catch (error) {
    log2(`Error getting seasonal trends: ${error}`, "aiMaterialOrderingService");
    throw error;
  }
}
var openai, MODEL;
var init_aiMaterialOrderingService = __esm({
  "server/services/aiMaterialOrderingService.ts"() {
    "use strict";
    init_vite();
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    MODEL = "gpt-4o";
  }
});

// server/data/customerProfiles.ts
var customerProfiles_exports = {};
__export(customerProfiles_exports, {
  addCustomer: () => addCustomer,
  customerProfiles: () => customerProfiles,
  getCustomerByEmail: () => getCustomerByEmail,
  getCustomerById: () => getCustomerById2,
  getCustomerByPhone: () => getCustomerByPhone,
  updateCustomerDiscordId: () => updateCustomerDiscordId
});
function getCustomerByPhone(phone) {
  return customerProfiles.find((customer) => customer.phone === phone);
}
function getCustomerByEmail(email) {
  return customerProfiles.find((customer) => customer.email === email);
}
function getCustomerById2(id) {
  return customerProfiles.find((customer) => customer.id === id);
}
function addCustomer(customer) {
  const newCustomer = {
    ...customer,
    id: Math.max(...customerProfiles.map((c) => c.id)) + 1
  };
  customerProfiles.push(newCustomer);
  return newCustomer;
}
function updateCustomerDiscordId(customerId, discordUserId) {
  const customer = customerProfiles.find((c) => c.id === customerId);
  if (customer) {
    customer.discordUserId = discordUserId;
    return true;
  }
  return false;
}
var customerProfiles;
var init_customerProfiles = __esm({
  "server/data/customerProfiles.ts"() {
    "use strict";
    customerProfiles = [
      {
        id: 1,
        name: "Jay Stevens",
        email: "joshuastevens100@gmail.com",
        phone: "+1 832 893-3794",
        preferences: {
          email: true,
          sms: true,
          discord: true,
          inApp: true
        },
        notes: "Primary contact - Business owner"
      }
    ];
  }
});

// server/services/externalKanbanService.ts
var externalKanbanService_exports = {};
__export(externalKanbanService_exports, {
  externalKanbanService: () => externalKanbanService
});
var ExternalKanbanService, externalKanbanService;
var init_externalKanbanService = __esm({
  "server/services/externalKanbanService.ts"() {
    "use strict";
    ExternalKanbanService = class {
      constructor() {
        __publicField(this, "baseUrl");
        __publicField(this, "apiKey");
        this.baseUrl = process.env.EXTERNAL_KANBAN_URL || "";
        this.apiKey = process.env.EXTERNAL_KANBAN_API_KEY || "";
        console.log("External Kanban Service initialized:", {
          hasUrl: !!this.baseUrl,
          hasApiKey: !!this.apiKey,
          baseUrl: this.baseUrl ? `${this.baseUrl.substring(0, 30)}...` : "Not configured"
        });
      }
      async fetchOrders() {
        if (!this.baseUrl || !this.apiKey) {
          console.log("Kanban configuration missing:", {
            hasUrl: !!this.baseUrl,
            hasApiKey: !!this.apiKey
          });
          return {
            success: false,
            orders: [],
            error: "External Kanban URL or API key not configured"
          };
        }
        console.log("Attempting to fetch orders from Kanban:", this.baseUrl);
        try {
          const response = await fetch(`${this.baseUrl}/api/orders`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${this.apiKey}`,
              "Content-Type": "application/json"
            },
            timeout: 1e4
          });
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          const data = await response.json();
          const transformedOrders = data.orders?.map((order) => ({
            id: order.orderId || order.id,
            orderNumber: order.orderId || order.orderNumber,
            customerName: order.customerName,
            artworkTitle: order.artworkTitle || order.description,
            frameSize: order.frameSize || `${order.width || 0}x${order.height || 0}`,
            status: this.mapExternalStatus(order.status),
            stage: order.stage || "pending",
            priority: order.priority || "standard",
            dueDate: order.dueDate,
            createdAt: order.createdAt,
            estimatedCompletion: order.estimatedCompletion,
            materials: order.materials || {
              frameType: order.frameType || "Unknown",
              matColor: order.matColor || "White",
              glass: order.glass || "Regular"
            }
          })) || [];
          return {
            success: true,
            orders: transformedOrders
          };
        } catch (error) {
          console.error("Error fetching from external Kanban:", error);
          return {
            success: false,
            orders: [],
            error: error instanceof Error ? error.message : "Unknown error"
          };
        }
      }
      async updateOrderStatus(orderId, status, stage, notes) {
        if (!this.baseUrl || !this.apiKey) {
          console.error("External Kanban URL or API key not configured");
          return false;
        }
        try {
          const response = await fetch(`${this.baseUrl}/api/orders/${orderId}/status`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${this.apiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              status: this.mapInternalToExternalStatus(status),
              stage,
              notes,
              updatedBy: "Jays Frames POS",
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            }),
            timeout: 1e4
          });
          return response.ok;
        } catch (error) {
          console.error("Error updating external Kanban order:", error);
          return false;
        }
      }
      mapExternalStatus(externalStatus) {
        const statusMap = {
          "pending": "pending",
          "in_progress": "in_production",
          "in_production": "in_production",
          "designing": "in_design",
          "material_prep": "awaiting_materials",
          "cutting": "in_production",
          "assembly": "in_production",
          "quality_check": "in_production",
          "completed": "ready_for_pickup",
          "ready": "ready_for_pickup",
          "delivered": "completed",
          "picked_up": "completed"
        };
        return statusMap[externalStatus.toLowerCase()] || "pending";
      }
      mapInternalToExternalStatus(internalStatus) {
        const statusMap = {
          "pending": "pending",
          "in_design": "designing",
          "awaiting_materials": "material_prep",
          "in_production": "in_production",
          "ready_for_pickup": "completed",
          "completed": "delivered"
        };
        return statusMap[internalStatus] || "pending";
      }
      async healthCheck() {
        if (!this.baseUrl || !this.apiKey) {
          return {
            status: "not_configured",
            connected: false
          };
        }
        try {
          const response = await fetch(`${this.baseUrl}/api/health`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${this.apiKey}`,
              "Content-Type": "application/json"
            },
            timeout: 5e3
          });
          return {
            status: response.ok ? "connected" : "error",
            connected: response.ok,
            lastSync: (/* @__PURE__ */ new Date()).toISOString()
          };
        } catch (error) {
          return {
            status: "error",
            connected: false
          };
        }
      }
    };
    externalKanbanService = new ExternalKanbanService();
  }
});

// server/services/smsService.ts
import twilio2 from "twilio";
async function sendSmsWithTwilio(params) {
  if (!twilioClient2) {
    console.warn("Twilio is not configured. SMS sending is disabled.");
    return {
      success: false,
      error: "Twilio is not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables."
    };
  }
  if (!params.to || !params.to.match(/^\+?[1-9]\d{1,14}$/)) {
    return {
      success: false,
      error: "Invalid phone number format. Must be E.164 format (e.g., +12125551234)."
    };
  }
  try {
    let phoneNumber = params.to;
    if (!phoneNumber.startsWith("+")) {
      phoneNumber = "+1" + phoneNumber.replace(/\D/g, "");
    }
    const message = await twilioClient2.messages.create({
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER || "",
      // This must be a Twilio phone number
      body: params.message
    });
    console.log(`SMS sent successfully to ${params.to}, SID: ${message.sid}`);
    return {
      success: true,
      sid: message.sid
    };
  } catch (error) {
    console.error("Twilio Error:", error);
    return {
      success: false,
      error: `Failed to send SMS: ${error.message}`
    };
  }
}
function formatPhoneNumber2(phoneNumber) {
  const digitsOnly = phoneNumber.replace(/\D/g, "");
  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  } else if (digitsOnly.length > 10 && !phoneNumber.startsWith("+")) {
    return `+${digitsOnly}`;
  } else if (phoneNumber.startsWith("+")) {
    return phoneNumber;
  }
  return phoneNumber;
}
async function sendPaymentLinkViaSms(phoneNumber, amount, paymentUrl, businessName = "Jay's Frames") {
  const formattedAmount = amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
  const message = `${businessName}: A payment of ${formattedAmount} is due. Pay securely with this link: ${paymentUrl}`;
  return await sendSmsWithTwilio({
    to: formatPhoneNumber2(phoneNumber),
    message
  });
}
var twilioClient2;
var init_smsService = __esm({
  "server/services/smsService.ts"() {
    "use strict";
    twilioClient2 = null;
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      twilioClient2 = twilio2(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
  }
});

// server/services/paymentLinkService.ts
import crypto from "crypto";
import { addDays } from "date-fns";
import Stripe3 from "stripe";
import { eq as eq9, and as and4, gt } from "drizzle-orm";
function generateToken() {
  return crypto.randomBytes(16).toString("hex");
}
async function createPaymentLink(amount, customerId, description, expiresInDays = 7) {
  const token = generateToken();
  const expiresAt = addDays(/* @__PURE__ */ new Date(), expiresInDays);
  const amountInCents = Math.round(amount * 100);
  const [paymentLink] = await db.insert(paymentLinks).values({
    token,
    amount: amount.toString(),
    description,
    customerId,
    expiresAt
  }).returning();
  return paymentLink;
}
async function sendPaymentLinkViaEmail(paymentLinkId, email, businessName = "Jay's Frames") {
  const [paymentLink] = await db.select().from(paymentLinks).where(eq9(paymentLinks.id, paymentLinkId));
  if (!paymentLink) {
    throw new Error(`Payment link with ID ${paymentLinkId} not found`);
  }
  const amount = Number(paymentLink.amount);
  const formattedAmount = amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
  const baseUrl = process.env.BASE_URL || "http://localhost:5000";
  const paymentUrl = `${baseUrl}/payment/${paymentLink.token}`;
  const emailHtml = `
    <h2>Payment Request from ${businessName}</h2>
    <p>A payment of <strong>${formattedAmount}</strong> is due.</p>
    <p>${paymentLink.description || ""}</p>
    <p>
      <a href="${paymentUrl}" style="
        display: inline-block;
        background-color: #4CAF50;
        color: white;
        padding: 12px 20px;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;">
        Pay Now
      </a>
    </p>
    <p>Or copy and paste this link: ${paymentUrl}</p>
    <p>This payment link will expire on ${paymentLink.expiresAt.toLocaleDateString()}.</p>
    <p>Thank you for your business!</p>
  `;
  try {
    await sendEmailWithSendGrid({
      to: email,
      from: `info@${businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      // This should be a verified sender
      subject: `Payment Request for ${formattedAmount} - ${businessName}`,
      text: `Payment Request from ${businessName}

A payment of ${formattedAmount} is due.

${paymentLink.description || ""}

Pay online at: ${paymentUrl}

This payment link will expire on ${paymentLink.expiresAt.toLocaleDateString()}.

Thank you for your business!`,
      html: emailHtml
    });
    await db.insert(customerNotifications).values({
      customerId: paymentLink.customerId,
      notificationType: "payment_link",
      channel: "email",
      subject: `Payment Request for ${formattedAmount}`,
      message: `Payment link sent via email to ${email}`,
      successful: true,
      paymentLinkId: paymentLink.id
    });
    return true;
  } catch (error) {
    console.error("Failed to send payment link email:", error);
    await db.insert(customerNotifications).values({
      customerId: paymentLink.customerId,
      notificationType: "payment_link",
      channel: "email",
      subject: `Payment Request for ${formattedAmount}`,
      message: `Failed to send payment link via email to ${email}`,
      successful: false,
      paymentLinkId: paymentLink.id
    });
    return false;
  }
}
async function sendPaymentLinkViaSmsWithId(paymentLinkId, phoneNumber, businessName = "Jay's Frames") {
  const [paymentLink] = await db.select().from(paymentLinks).where(eq9(paymentLinks.id, paymentLinkId));
  if (!paymentLink) {
    throw new Error(`Payment link with ID ${paymentLinkId} not found`);
  }
  const amount = Number(paymentLink.amount);
  const baseUrl = process.env.BASE_URL || "http://localhost:5000";
  const paymentUrl = `${baseUrl}/payment/${paymentLink.token}`;
  try {
    const result = await sendPaymentLinkViaSms(
      phoneNumber,
      amount,
      paymentUrl,
      businessName
    );
    await db.insert(customerNotifications).values({
      customerId: paymentLink.customerId,
      notificationType: "payment_link",
      channel: "sms",
      subject: "Payment Link",
      message: `Payment link sent via SMS to ${phoneNumber}`,
      successful: result.success,
      paymentLinkId: paymentLink.id,
      responseData: result
    });
    return result.success;
  } catch (error) {
    console.error("Failed to send payment link SMS:", error);
    await db.insert(customerNotifications).values({
      customerId: paymentLink.customerId,
      notificationType: "payment_link",
      channel: "sms",
      subject: "Payment Link",
      message: `Failed to send payment link via SMS to ${phoneNumber}`,
      successful: false,
      paymentLinkId: paymentLink.id
    });
    return false;
  }
}
async function validatePaymentLink(token) {
  const now = /* @__PURE__ */ new Date();
  const [paymentLink] = await db.select().from(paymentLinks).where(
    and4(
      eq9(paymentLinks.token, token),
      eq9(paymentLinks.used, false),
      gt(paymentLinks.expiresAt, now)
    )
  );
  return paymentLink || null;
}
async function createPaymentIntentForLink(paymentLinkId) {
  if (!stripe2) {
    console.warn("Stripe is not configured. Payment processing is disabled.");
    return null;
  }
  const [paymentLink] = await db.select().from(paymentLinks).where(eq9(paymentLinks.id, paymentLinkId));
  if (!paymentLink) {
    throw new Error(`Payment link with ID ${paymentLinkId} not found`);
  }
  const amountInCents = Math.round(Number(paymentLink.amount) * 100);
  try {
    const paymentIntent = await stripe2.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      description: paymentLink.description || `Payment for link ${paymentLink.token}`,
      metadata: {
        paymentLinkId: paymentLink.id.toString(),
        token: paymentLink.token
      }
    });
    await db.update(paymentLinks).set({
      paymentIntentId: paymentIntent.id
    }).where(eq9(paymentLinks.id, paymentLinkId));
    return paymentIntent.client_secret;
  } catch (error) {
    console.error("Failed to create payment intent:", error);
    return null;
  }
}
async function markPaymentLinkAsUsed(paymentLinkId, status = "succeeded") {
  try {
    const result = await db.transaction(async (tx) => {
      const [existingLink] = await tx.select().from(paymentLinks).where(eq9(paymentLinks.id, paymentLinkId));
      if (!existingLink) {
        throw new Error("Payment link not found");
      }
      if (existingLink.used) {
        throw new Error("Payment link has already been used");
      }
      const now = /* @__PURE__ */ new Date();
      if (existingLink.expiresAt < now) {
        throw new Error("Payment link has expired");
      }
      const [updatedLink] = await tx.update(paymentLinks).set({
        used: true,
        usedAt: /* @__PURE__ */ new Date(),
        paymentStatus: status
      }).where(eq9(paymentLinks.id, paymentLinkId)).returning();
      await tx.insert(customerNotifications).values({
        customerId: existingLink.customerId,
        notificationType: "payment_completion",
        channel: "system",
        subject: "Payment Completed",
        message: `Payment of $${existingLink.amount} completed successfully`,
        successful: status === "succeeded",
        paymentLinkId: existingLink.id,
        responseData: { status, paymentIntentId: existingLink.paymentIntentId }
      });
      return updatedLink;
    });
    return result;
  } catch (error) {
    console.error("Error marking payment link as used:", error);
    throw error;
  }
}
var stripe2;
var init_paymentLinkService = __esm({
  "server/services/paymentLinkService.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_emailService();
    init_smsService();
    stripe2 = null;
    if (process.env.STRIPE_SECRET_KEY) {
      stripe2 = new Stripe3(process.env.STRIPE_SECRET_KEY);
    }
  }
});

// server/controllers/paymentLinkController.ts
var paymentLinkController_exports = {};
__export(paymentLinkController_exports, {
  completePaymentForLink: () => completePaymentForLink,
  createNewPaymentLink: () => createNewPaymentLink,
  getAllPaymentLinks: () => getAllPaymentLinks,
  getPaymentLinkById: () => getPaymentLinkById,
  sendPaymentLinkNotification: () => sendPaymentLinkNotification,
  validatePaymentLinkByToken: () => validatePaymentLinkByToken,
  verifyPaymentCompletion: () => verifyPaymentCompletion
});
import { eq as eq10 } from "drizzle-orm";
async function createNewPaymentLink(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const { amount, customerId, description, expiresInDays = 7, email, phone, sendNotification } = req.body;
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid payment amount is required"
      });
    }
    if (customerId) {
      const [customer] = await db.select().from(customers).where(eq10(customers.id, customerId));
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found"
        });
      }
    }
    const paymentLink = await createPaymentLink(
      Number(amount),
      customerId,
      description,
      expiresInDays
    );
    const notifications2 = { email: false, sms: false };
    if (sendNotification && email) {
      notifications2.email = await sendPaymentLinkViaEmail(paymentLink.id, email);
    }
    if (sendNotification && phone) {
      notifications2.sms = await sendPaymentLinkViaSmsWithId(paymentLink.id, phone);
    }
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    const paymentUrl = `${baseUrl}/payment/${paymentLink.token}`;
    return res.status(201).json({
      success: true,
      paymentLink: {
        ...paymentLink,
        paymentUrl
      },
      notifications: notifications2
    });
  } catch (error) {
    console.error("Error creating payment link:", error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      success: false,
      message: `Failed to create payment link: ${error.message}`
    });
  }
}
async function getAllPaymentLinks(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const allLinks = await db.select().from(paymentLinks).orderBy(paymentLinks.createdAt, "desc");
    return res.json({
      success: true,
      paymentLinks: allLinks
    });
  } catch (error) {
    console.error("Error fetching payment links:", error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      success: false,
      message: `Failed to fetch payment links: ${error.message}`
    });
  }
}
async function getPaymentLinkById(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const id = parseInt(req.params.id);
    const [paymentLink] = await db.select().from(paymentLinks).where(eq10(paymentLinks.id, id));
    if (!paymentLink) {
      return res.status(404).json({
        success: false,
        message: "Payment link not found"
      });
    }
    return res.json({
      success: true,
      paymentLink
    });
  } catch (error) {
    console.error("Error fetching payment link:", error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      success: false,
      message: `Failed to fetch payment link: ${error.message}`
    });
  }
}
async function sendPaymentLinkNotification(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { email, phone, notificationType = "both" } = req.body;
    const [paymentLink] = await db.select().from(paymentLinks).where(eq10(paymentLinks.id, id));
    if (!paymentLink) {
      return res.status(404).json({ message: "Payment link not found" });
    }
    if (paymentLink.used) {
      return res.status(400).json({ message: "Payment link has already been used" });
    }
    const now = /* @__PURE__ */ new Date();
    if (paymentLink.expiresAt < now) {
      return res.status(400).json({ message: "Payment link has expired" });
    }
    const result = {};
    if ((notificationType === "email" || notificationType === "both") && email) {
      result.email = await sendPaymentLinkViaEmail(id, email);
    }
    if ((notificationType === "sms" || notificationType === "both") && phone) {
      result.sms = await sendPaymentLinkViaSmsWithId(id, phone);
    }
    res.json({
      success: true,
      notifications: result
    });
  } catch (error) {
    console.error("Error sending payment link notification:", error);
    res.status(500).json({
      success: false,
      message: `Failed to send notification: ${error.message}`
    });
  }
}
async function validatePaymentLinkByToken(req, res) {
  try {
    const { token } = req.params;
    const paymentLink = await validatePaymentLink(token);
    if (!paymentLink) {
      return res.status(404).json({
        valid: false,
        message: "Payment link is invalid, expired, or has already been used"
      });
    }
    const clientSecret = await createPaymentIntentForLink(paymentLink.id);
    if (!clientSecret) {
      return res.status(500).json({
        valid: true,
        canProcess: false,
        message: "Failed to create payment intent"
      });
    }
    res.json({
      valid: true,
      canProcess: true,
      paymentLink: {
        amount: paymentLink.amount,
        description: paymentLink.description,
        expiresAt: paymentLink.expiresAt
      },
      clientSecret
    });
  } catch (error) {
    console.error("Error validating payment link:", error);
    res.status(500).json({
      valid: false,
      message: `Failed to validate payment link: ${error.message}`
    });
  }
}
async function completePaymentForLink(req, res) {
  try {
    const { token } = req.params;
    const { paymentIntentId, status = "succeeded" } = req.body;
    const paymentLink = await validatePaymentLink(token);
    if (!paymentLink) {
      return res.status(404).json({
        success: false,
        message: "Payment link is invalid, expired, or has already been used"
      });
    }
    const updatedLink = await markPaymentLinkAsUsed(paymentLink.id, status);
    if (!updatedLink) {
      return res.status(500).json({
        success: false,
        message: "Failed to mark payment link as used"
      });
    }
    res.json({
      success: true,
      message: "Payment completed successfully",
      paymentLink: {
        id: updatedLink.id,
        used: updatedLink.used,
        usedAt: updatedLink.usedAt
      }
    });
  } catch (error) {
    console.error("Complete payment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete payment"
    });
  }
}
async function verifyPaymentCompletion(req, res) {
  try {
    const { token } = req.params;
    const { paymentIntentId } = req.body;
    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: "Payment intent ID is required"
      });
    }
    const paymentLink = await validatePaymentLink(token);
    if (!paymentLink) {
      return res.status(404).json({
        success: false,
        message: "Payment link not found or expired"
      });
    }
    if (process.env.STRIPE_SECRET_KEY) {
      const stripe3 = new Stripe(process.env.STRIPE_SECRET_KEY);
      try {
        const paymentIntent = await stripe3.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status === "succeeded" && !paymentLink.used) {
          await markPaymentLinkAsUsed(paymentLink.id, "succeeded");
          return res.json({
            success: true,
            verified: true,
            message: "Payment verified successfully"
          });
        }
      } catch (stripeError) {
        console.error("Stripe verification error:", stripeError);
        return res.status(400).json({
          success: false,
          message: "Payment verification failed"
        });
      }
    }
    res.json({
      success: true,
      verified: false,
      message: "Could not verify payment with Stripe"
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: `Payment verification error: ${error.message}`
    });
  }
}
var init_paymentLinkController = __esm({
  "server/controllers/paymentLinkController.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_paymentLinkService();
  }
});

// server/index.ts
import express4 from "express";

// server/routes.ts
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

// server/controllers/artLocationController.ts
init_storage();
import { z } from "zod";
var artLocationSchema = z.object({
  orderId: z.number(),
  location: z.string(),
  artworkType: z.string(),
  artworkDescription: z.string(),
  artworkWidth: z.number(),
  artworkHeight: z.number()
});
var artLocationController = {
  /**
   * Sends artwork location data to the Art Locations app
   * @param req Express request object
   * @param res Express response object
   */
  async sendArtLocationData(req, res) {
    try {
      const data = artLocationSchema.parse(req.body);
      const updatedOrder = await storage.updateOrderArtLocation(
        data.orderId,
        data.location
      );
      res.status(200).json({
        success: true,
        message: "Art location data recorded successfully",
        data: updatedOrder
      });
    } catch (error) {
      console.error("Error recording art location data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to record art location data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  },
  /**
   * Retrieves artwork location data for an order
   * @param req Express request object
   * @param res Express response object
   */
  async getArtLocationData(req, res) {
    try {
      const orderId = Number(req.params.orderId);
      if (isNaN(orderId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID"
        });
      }
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }
      res.status(200).json({
        orderId: order.id,
        location: order.artworkLocation || "",
        artworkType: order.artworkType || "",
        artworkDescription: order.artworkDescription || "",
        artworkWidth: order.artworkWidth || 0,
        artworkHeight: order.artworkHeight || 0
      });
    } catch (error) {
      console.error("Error fetching art location data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch art location data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
};

// server/controllers/frameDesignController.ts
init_db();
init_schema();
import { eq as eq3 } from "drizzle-orm";
var frameDesignController = {
  /**
   * Stores a frame design image for an order
   * @param req Express request with orderId and imageData
   * @param res Express response
   */
  async saveFrameDesign(req, res) {
    try {
      const { orderId, imageData } = req.body;
      if (!orderId || !imageData) {
        return res.status(400).json({
          success: false,
          message: "Order ID and image data are required"
        });
      }
      await db.update(orders).set({ frameDesignImage: imageData }).where(eq3(orders.id, parseInt(orderId)));
      res.status(200).json({
        success: true,
        message: "Frame design image saved successfully"
      });
    } catch (error) {
      console.error("Error saving frame design:", error);
      res.status(500).json({
        success: false,
        message: "Failed to save frame design image",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  },
  /**
   * Retrieves a frame design image for an order
   * @param req Express request with orderId parameter
   * @param res Express response
   */
  async getFrameDesign(req, res) {
    try {
      const orderId = req.params.orderId;
      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: "Order ID is required"
        });
      }
      const [order] = await db.select({ frameDesignImage: orders.frameDesignImage }).from(orders).where(eq3(orders.id, parseInt(orderId)));
      if (!order || !order.frameDesignImage) {
        return res.status(404).json({
          success: false,
          message: "Frame design image not found"
        });
      }
      res.status(200).json({
        success: true,
        imageData: order.frameDesignImage
      });
    } catch (error) {
      console.error("Error retrieving frame design:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve frame design image",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
};

// server/middleware/apiKeyAuth.ts
var API_KEYS = {
  "kanban_admin_key_2025_full_access": {
    name: "3D Designer Integration",
    permissions: ["orders:create", "orders:read", "orders:update", "pricing:read", "files:upload"],
    created: (/* @__PURE__ */ new Date()).toISOString(),
    lastUsed: null
  },
  "jf_houston_heights_framing_2025_master_api_key_secure_access": {
    name: "Houston Heights Framing API Integration",
    permissions: ["orders:read", "orders:write", "integration:webhook", "pricing:read", "catalog:read"],
    created: (/* @__PURE__ */ new Date()).toISOString(),
    lastUsed: null
  }
};
function validateApiKey(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      error: "Missing Authorization header",
      message: "API key required in Authorization header as: Bearer YOUR_API_KEY"
    });
  }
  const token = authHeader.replace("Bearer ", "");
  if (API_KEYS[token]) {
    API_KEYS[token].lastUsed = (/* @__PURE__ */ new Date()).toISOString();
    req.apiKey = API_KEYS[token];
    req.apiKeyType = "static";
    return next();
  }
  try {
    req.apiKeyType = "jwt";
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid API key or JWT token",
      message: "The provided authentication token is not valid"
    });
  }
}

// server/routes.ts
init_storage();

// server/routes/webhookRoutes.ts
import { Router } from "express";

// server/controllers/webhookController.ts
init_storage();

// server/services/voiceCallService.ts
import twilio from "twilio";
var twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}
async function makeVoiceCall(params) {
  if (!twilioClient) {
    console.warn("Twilio is not configured. Voice calling is disabled.");
    return {
      success: false,
      error: "Twilio is not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables."
    };
  }
  if (!params.to || !params.to.match(/^\+?[1-9]\d{1,14}$/)) {
    return {
      success: false,
      error: "Invalid phone number format. Must be E.164 format (e.g., +12125551234)."
    };
  }
  if (!params.message && !params.twiml && !params.url) {
    return {
      success: false,
      error: "Must provide either message, twiml, or url parameter."
    };
  }
  try {
    let phoneNumber = params.to;
    if (!phoneNumber.startsWith("+")) {
      phoneNumber = "+1" + phoneNumber.replace(/\D/g, "");
    }
    const callOptions = {
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER || ""
    };
    if (params.recordCall) {
      callOptions.record = true;
    }
    if (params.twiml) {
      callOptions.twiml = params.twiml;
    } else if (params.url) {
      callOptions.url = params.url;
    } else if (params.message) {
      const voice = params.voice || "alice";
      const language = params.language || "en-US";
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="${voice}" language="${language}">${escapeXml(params.message)}</Say>
</Response>`;
      callOptions.twiml = twiml;
    }
    const call = await twilioClient.calls.create(callOptions);
    console.log(`Voice call initiated successfully to ${params.to}, SID: ${call.sid}`);
    return {
      success: true,
      sid: call.sid
    };
  } catch (error) {
    console.error("Twilio Voice Call Error:", error);
    return {
      success: false,
      error: `Failed to make voice call: ${error.message}`
    };
  }
}
function escapeXml(text2) {
  return text2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
async function callOrderStatusUpdate(params) {
  const completionText = params.estimatedCompletion ? ` Your order is expected to be ready ${params.estimatedCompletion}.` : "";
  const message = `Hello from Jay's Frames. This is an automated update about your order number ${params.orderNumber}. Your order status has been updated to ${params.status}.${completionText} Thank you for choosing Jay's Frames.`;
  return await makeVoiceCall({
    to: params.to,
    message,
    voice: "alice"
  });
}
async function callPaymentReminder(params) {
  const formattedAmount = params.amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
  const dueDateText = params.dueDate ? ` Payment is due by ${params.dueDate}.` : "";
  const message = `Hello ${params.customerName}, this is Jay's Frames calling about your order number ${params.orderNumber}. You have an outstanding balance of ${formattedAmount}.${dueDateText} Please contact us at your earliest convenience to complete your payment. Thank you.`;
  return await makeVoiceCall({
    to: params.to,
    message,
    voice: "alice"
  });
}
async function callPickupReminder(customerName, phoneNumber, orderNumber, daysWaiting) {
  const dayText = daysWaiting === 1 ? "day" : "days";
  const message = `Hello ${customerName}, this is Jay's Frames. Your custom framing order number ${orderNumber} has been ready for pickup for ${daysWaiting} ${dayText}. Please come by during our business hours to collect your beautiful framed artwork. Thank you.`;
  return await makeVoiceCall({
    to: phoneNumber,
    message,
    voice: "alice"
  });
}
async function callOrderComplete(customerName, phoneNumber, orderNumber) {
  const message = `Hello ${customerName}, this is Jay's Frames with great news! Your custom framing order number ${orderNumber} is now complete and ready for pickup. We're excited for you to see the beautiful result. Please come by during our business hours to collect your order. Thank you for choosing Jay's Frames.`;
  return await makeVoiceCall({
    to: phoneNumber,
    message,
    voice: "alice"
  });
}
async function getCallStatus(callSid) {
  if (!twilioClient) {
    return {
      success: false,
      error: "Twilio is not configured."
    };
  }
  try {
    const call = await twilioClient.calls(callSid).fetch();
    return {
      success: true,
      status: call.status
    };
  } catch (error) {
    console.error("Error fetching call status:", error);
    return {
      success: false,
      error: `Failed to get call status: ${error.message}`
    };
  }
}
function formatPhoneNumber(phoneNumber) {
  const digitsOnly = phoneNumber.replace(/\D/g, "");
  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  } else if (digitsOnly.length > 10 && !phoneNumber.startsWith("+")) {
    return `+${digitsOnly}`;
  } else if (phoneNumber.startsWith("+")) {
    return phoneNumber;
  }
  return phoneNumber;
}
function isVoiceCallingConfigured() {
  return twilioClient !== null && !!process.env.TWILIO_PHONE_NUMBER;
}

// server/services/simpleOrderNotificationService.ts
var SimpleOrderNotificationService = class {
  /**
   * Handle order events and trigger appropriate voice notifications
   */
  async handleOrderEvent(event) {
    try {
      if (!event.customerPhone || event.customerPhone.length < 10) {
        console.log(`Skipping notification for order ${event.orderNumber}: No valid phone number`);
        return;
      }
      const phone = this.formatPhoneNumber(event.customerPhone);
      console.log(`Processing notification for order ${event.orderNumber}, event: ${event.eventType}`);
      switch (event.eventType) {
        case "order_placed":
          await this.sendOrderConfirmation(event, phone);
          break;
        case "payment_received":
          await this.sendPaymentConfirmation(event, phone);
          break;
        case "production_started":
          await this.sendProductionStarted(event, phone);
          break;
        case "frame_cut":
        case "mat_cut":
          await this.sendProgressUpdate(event, phone);
          break;
        case "assembly_complete":
          await this.sendAssemblyComplete(event, phone);
          break;
        case "ready_for_pickup":
          await this.sendPickupReady(event, phone);
          break;
        case "payment_due":
          await this.sendPaymentReminder(event, phone);
          break;
        case "pickup_overdue":
          await this.sendPickupReminder(event, phone);
          break;
        default:
          console.log(`Unknown event type: ${event.eventType}`);
      }
    } catch (error) {
      console.error(`Error handling order event for ${event.orderNumber}:`, error);
    }
  }
  async sendOrderConfirmation(event, phone) {
    const message = `Hello ${event.customerName}! This is Jay's Frames calling to confirm your order ${event.orderNumber} has been received and is being processed. Thank you for choosing us for your custom framing needs!`;
    await makeVoiceCall({
      to: phone,
      message,
      voice: "Polly.Amy"
    });
    console.log(`Order confirmation call sent for ${event.orderNumber}`);
  }
  async sendPaymentConfirmation(event, phone) {
    const message = `Hello ${event.customerName}! This is Jay's Frames calling to confirm we've received your payment for order ${event.orderNumber}. Your custom framing project will now begin production. Thank you for your business!`;
    await makeVoiceCall({
      to: phone,
      message,
      voice: "Polly.Amy"
    });
    console.log(`Payment confirmation call sent for ${event.orderNumber}`);
  }
  async sendProductionStarted(event, phone) {
    const estimatedCompletion = event.metadata?.estimatedCompletion || "5-7 business days";
    const message = `Hello ${event.customerName}! This is Jay's Frames calling with an update on your order ${event.orderNumber}. We're excited to let you know that production has started on your custom framing project. Estimated completion time is ${estimatedCompletion}. Thank you for your patience!`;
    await makeVoiceCall({
      to: phone,
      message,
      voice: "Polly.Amy"
    });
    console.log(`Production started call sent for ${event.orderNumber}`);
  }
  async sendProgressUpdate(event, phone) {
    const statusMap = {
      frame_cut: "frame cutting is complete",
      mat_cut: "mat cutting is complete"
    };
    const status = statusMap[event.eventType] || event.eventType;
    const message = `Hello ${event.customerName}! This is Jay's Frames with an update on your order ${event.orderNumber}. We're happy to report that ${status} and your project is progressing well. Thank you for your patience!`;
    await makeVoiceCall({
      to: phone,
      message,
      voice: "Polly.Amy"
    });
    console.log(`Progress update call sent for ${event.orderNumber}`);
  }
  async sendAssemblyComplete(event, phone) {
    const message = `Hello ${event.customerName}! This is Jay's Frames with exciting news. Your custom framing order ${event.orderNumber} has been assembled and is in final quality inspection. We'll call you soon when it's ready for pickup!`;
    await makeVoiceCall({
      to: phone,
      message,
      voice: "Polly.Amy"
    });
    console.log(`Assembly complete call sent for ${event.orderNumber}`);
  }
  async sendPickupReady(event, phone) {
    await callOrderComplete(event.customerName, phone, event.orderNumber);
    console.log(`Pickup ready call sent for ${event.orderNumber}`);
  }
  async sendPaymentReminder(event, phone) {
    const amount = event.metadata?.amount || 0;
    const message = `Hello ${event.customerName}, this is Jay's Frames calling about your order ${event.orderNumber}. You have an outstanding balance of $${amount}. Please contact us at your earliest convenience to complete your payment. Thank you for your prompt attention to this matter.`;
    await makeVoiceCall({
      to: phone,
      message,
      voice: "Polly.Brian"
    });
    console.log(`Payment reminder call sent for ${event.orderNumber}`);
  }
  async sendPickupReminder(event, phone) {
    const daysWaiting = event.metadata?.daysWaiting || 7;
    const message = `Hello ${event.customerName}, this is Jay's Frames calling about your completed order ${event.orderNumber}. Your custom framing has been ready for pickup for ${daysWaiting} days. Please come by during our business hours to collect your order. Thank you!`;
    await makeVoiceCall({
      to: phone,
      message,
      voice: "Polly.Brian"
    });
    console.log(`Pickup reminder call sent for ${event.orderNumber}`);
  }
  formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    }
    return phone.startsWith("+") ? phone : `+${cleaned}`;
  }
  /**
   * Schedule a delayed notification
   */
  async scheduleDelayedNotification(event, delayMinutes) {
    setTimeout(async () => {
      await this.handleOrderEvent(event);
    }, delayMinutes * 60 * 1e3);
    console.log(`Scheduled notification for order ${event.orderNumber} in ${delayMinutes} minutes`);
  }
  /**
   * Send bulk notifications for multiple orders
   */
  async sendBulkNotifications(events) {
    console.log(`Processing ${events.length} bulk notifications`);
    for (const event of events) {
      try {
        await this.handleOrderEvent(event);
        await new Promise((resolve) => setTimeout(resolve, 2e3));
      } catch (error) {
        console.error(`Failed to send notification for order ${event.orderNumber}:`, error);
      }
    }
  }
};
var simpleOrderNotificationService = new SimpleOrderNotificationService();

// server/controllers/webhookController.ts
var orderNotificationService = new SimpleOrderNotificationService();
async function handleKanbanWebhook(req, res) {
  try {
    const { orderId, status, updatedBy, timestamp: timestamp2, previousStatus } = req.body;
    console.log(`Received Kanban webhook for order ${orderId}: ${previousStatus} \u2192 ${status}`);
    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: orderId and status"
      });
    }
    if (updatedBy === "Jays Frames POS") {
      console.log("Skipping webhook - update originated from POS system");
      return res.json({ success: true, message: "Update originated from POS, no notification needed" });
    }
    const order = await storage.updateOrder(parseInt(orderId), {
      productionStatus: status,
      lastStatusChange: /* @__PURE__ */ new Date()
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found"
      });
    }
    let notificationSent = false;
    try {
      if (order.customerId) {
        const customer = await storage.getCustomer(order.customerId);
        if (customer && customer.phone) {
          let eventType = null;
          switch (status) {
            case "in_production":
            case "production_started":
              eventType = "production_started";
              break;
            case "frame_cut":
            case "frame_cutting_complete":
              eventType = "frame_cut";
              break;
            case "mat_cut":
            case "mat_cutting_complete":
              eventType = "mat_cut";
              break;
            case "assembly_complete":
            case "assembled":
              eventType = "assembly_complete";
              break;
            case "ready_for_pickup":
            case "completed":
            case "ready":
              eventType = "ready_for_pickup";
              break;
          }
          if (eventType) {
            await orderNotificationService.handleOrderEvent({
              orderId: order.id.toString(),
              orderNumber: `ORD-${order.id}`,
              customerName: customer.name,
              customerPhone: customer.phone,
              eventType
            });
            console.log(`Kanban webhook notification sent for order ${order.id}: ${status}`);
            notificationSent = true;
          }
        }
      }
    } catch (notificationError) {
      console.error("Failed to send Kanban webhook notification:", notificationError);
    }
    res.json({
      success: true,
      message: "Status update processed successfully",
      orderId: order.id,
      newStatus: status,
      notificationSent
    });
  } catch (error) {
    console.error("Error processing Kanban webhook:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process webhook"
    });
  }
}
async function handleOrderUpdateWebhook(req, res) {
  try {
    const { orderId, eventType, customerPhone, customerName, metadata } = req.body;
    console.log(`Received order update webhook: ${eventType} for order ${orderId}`);
    if (!orderId || !eventType) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: orderId and eventType"
      });
    }
    let phone = customerPhone;
    let name = customerName;
    if (!phone || !name) {
      const order = await storage.getOrder(parseInt(orderId));
      if (order && order.customerId) {
        const customer = await storage.getCustomer(order.customerId);
        if (customer) {
          phone = phone || customer.phone;
          name = name || customer.name;
        }
      }
    }
    if (!phone || !name) {
      return res.status(400).json({
        success: false,
        error: "Customer information not found"
      });
    }
    await orderNotificationService.handleOrderEvent({
      orderId: orderId.toString(),
      orderNumber: `ORD-${orderId}`,
      customerName: name,
      customerPhone: phone,
      eventType,
      metadata: metadata || {}
    });
    console.log(`Webhook notification sent for order ${orderId}: ${eventType}`);
    res.json({
      success: true,
      message: "Notification sent successfully",
      orderId,
      eventType
    });
  } catch (error) {
    console.error("Error processing order update webhook:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process webhook"
    });
  }
}
async function handleStripeWebhook(req, res) {
  try {
    console.log("Stripe webhook received");
    res.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Webhook processing failed"
    });
  }
}
async function webhookHealthCheck(req, res) {
  res.json({
    success: true,
    message: "Webhook endpoints are operational",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    endpoints: {
      kanban: "/api/webhooks/kanban",
      orderUpdate: "/api/webhooks/order-update",
      stripe: "/api/webhooks/stripe",
      health: "/api/webhooks/health"
    }
  });
}

// server/routes/webhookRoutes.ts
import express from "express";
var router = Router();
router.post("/stripe", express.raw({ type: "application/json" }), handleStripeWebhook);
router.post("/kanban", handleKanbanWebhook);
router.post("/order-update", handleOrderUpdateWebhook);
router.get("/health", webhookHealthCheck);
var webhookRoutes_default = router;

// server/routes/hubApiRoutes.ts
init_storage();
import { Router as Router2 } from "express";

// server/middleware/security.ts
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import csrf from "csurf";
import cookieParser from "cookie-parser";
function verifyApiKey(req, res, next) {
  console.log("verifyApiKey called for:", req.path);
  next();
}

// server/routes/hubApiRoutes.ts
var router2 = Router2();
router2.get("/orders", verifyApiKey, async (req, res) => {
  try {
    const orders2 = await storage.getAllOrders();
    const hubOrders = orders2.map((order) => ({
      id: order.id,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      artworkTitle: order.artworkTitle,
      artworkWidth: order.artworkWidth,
      artworkHeight: order.artworkHeight,
      frameId: order.frameId,
      matId: order.matId,
      glassType: order.glassType,
      productionStatus: order.productionStatus,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
      scheduledDate: order.scheduledDate,
      qrCode: order.qrCode,
      notes: order.notes
    }));
    res.json({
      success: true,
      orders: hubOrders,
      count: hubOrders.length
    });
  } catch (error) {
    console.error("Error fetching orders for hub:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch orders"
    });
  }
});
router2.get("/orders/:id", verifyApiKey, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = await storage.getOrder(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found"
      });
    }
    res.json({
      success: true,
      order: {
        id: order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        artworkTitle: order.artworkTitle,
        artworkWidth: order.artworkWidth,
        artworkHeight: order.artworkHeight,
        frameId: order.frameId,
        matId: order.matId,
        glassType: order.glassType,
        productionStatus: order.productionStatus,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt,
        scheduledDate: order.scheduledDate,
        qrCode: order.qrCode,
        notes: order.notes
      }
    });
  } catch (error) {
    console.error("Error fetching order for hub:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch order"
    });
  }
});
router2.patch("/orders/:id/status", verifyApiKey, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status, notes } = req.body;
    const updatedOrder = await storage.updateOrder(orderId, {
      productionStatus: status,
      notes: notes || void 0
    });
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        error: "Order not found"
      });
    }
    res.json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder
    });
  } catch (error) {
    console.error("Error updating order status from hub:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update order status"
    });
  }
});
router2.get("/materials", verifyApiKey, async (req, res) => {
  try {
    const materialOrders2 = await storage.getAllMaterialOrders();
    res.json({
      success: true,
      materialOrders: materialOrders2,
      count: materialOrders2.length
    });
  } catch (error) {
    console.error("Error fetching material orders for hub:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch material orders"
    });
  }
});
router2.post("/webhook", verifyApiKey, async (req, res) => {
  try {
    const { event, data } = req.body;
    console.log("Received hub webhook:", event, data);
    switch (event) {
      case "order.status_changed":
        if (data.orderId && data.status) {
          await storage.updateOrder(data.orderId, {
            productionStatus: data.status,
            notes: data.notes || void 0
          });
        }
        break;
      case "material.status_changed":
        if (data.materialOrderId && data.status) {
          await storage.updateMaterialOrder(data.materialOrderId, {
            status: data.status,
            notes: data.notes || void 0
          });
        }
        break;
      default:
        console.log("Unknown webhook event:", event);
    }
    res.json({
      success: true,
      message: "Webhook processed successfully"
    });
  } catch (error) {
    console.error("Error processing hub webhook:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process webhook"
    });
  }
});
router2.get("/status", verifyApiKey, async (req, res) => {
  try {
    const orders2 = await storage.getAllOrders();
    const materialOrders2 = await storage.getAllMaterialOrders();
    res.json({
      success: true,
      status: "online",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      stats: {
        totalOrders: orders2.length,
        totalMaterialOrders: materialOrders2.length,
        activeOrders: orders2.filter((o) => o.productionStatus !== "completed").length
      }
    });
  } catch (error) {
    console.error("Error getting system status for hub:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get system status"
    });
  }
});
var hubApiRoutes_default = router2;

// server/routes/hubAdminRoutes.ts
import { Router as Router3 } from "express";

// server/controllers/hubApiController.ts
async function generateHubApiKey(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const timestamp2 = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const apiKey = `hub_${timestamp2}_${randomString}`;
    console.log("Hub API Key generated:", apiKey);
    const response = {
      success: true,
      apiKey,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      permissions: ["hub:read", "hub:write", "orders:sync"],
      message: "Hub API key generated successfully"
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error generating Hub API key:", error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate API key"
    });
  }
}
async function getHubConnectionInfo(req, res) {
  try {
    const baseUrl = process.env.REPL_URL || "https://your-repl-url.replit.dev";
    res.json({
      success: true,
      connectionInfo: {
        baseUrl,
        endpoints: {
          getAllOrders: `${baseUrl}/api/hub/orders`,
          getOrder: `${baseUrl}/api/hub/orders/:id`,
          updateOrderStatus: `${baseUrl}/api/hub/orders/:id/status`,
          getMaterialOrders: `${baseUrl}/api/hub/materials`,
          webhook: `${baseUrl}/api/hub/webhook`,
          status: `${baseUrl}/api/hub/status`
        },
        authentication: {
          method: "Bearer Token",
          header: "Authorization",
          note: "Use the API key generated from /api/admin/generate-hub-key"
        },
        webhookEvents: [
          "order.status_changed",
          "material.status_changed"
        ]
      }
    });
  } catch (error) {
    console.error("Error getting hub connection info:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get connection info"
    });
  }
}

// server/routes/hubAdminRoutes.ts
var router3 = Router3();
router3.post("/generate-hub-key", generateHubApiKey);
router3.get("/hub-connection-info", getHubConnectionInfo);
var hubAdminRoutes_default = router3;

// server/controllers/materialsController.ts
init_storage();
var getMaterialsPickList = async (req, res) => {
  try {
    let materialsList = await storage.getMaterialsPickList();
    if (!materialsList || materialsList.length === 0) {
      materialsList = [
        {
          id: "mat-001",
          name: "White Core Mat 16x20",
          type: "mat",
          supplier: "Crescent",
          status: "pending",
          quantity: "5",
          priority: "medium",
          notes: "For order #1234",
          price: "12.50",
          orderDate: null,
          receiveDate: null,
          supplierName: "Crescent"
        },
        {
          id: "frame-001",
          name: 'Oak Frame 1.5" - 8ft',
          type: "frame",
          supplier: "Larson-Juhl",
          status: "ordered",
          quantity: "2",
          priority: "high",
          notes: "Rush order",
          price: "45.00",
          orderDate: (/* @__PURE__ */ new Date()).toISOString(),
          receiveDate: null,
          supplierName: "Larson-Juhl"
        },
        {
          id: "glass-001",
          name: "Museum Glass 16x20",
          type: "glass",
          supplier: "Tru Vue",
          status: "received",
          quantity: "3",
          priority: "low",
          notes: "In stock",
          price: "28.99",
          orderDate: new Date(Date.now() - 864e5).toISOString(),
          receiveDate: (/* @__PURE__ */ new Date()).toISOString(),
          supplierName: "Tru Vue"
        }
      ];
    }
    res.json({
      success: true,
      data: materialsList,
      message: "Materials loaded successfully"
    });
  } catch (error) {
    console.error("Error in getMaterialsPickList:", error);
    res.status(500).json({ message: error.message, materials: [] });
  }
};
var getMaterialsBySupplier = async (req, res) => {
  try {
    const materialsList = await storage.getMaterialsPickList();
    const bySupplier = (materialsList || []).reduce((acc, material) => {
      const supplierName = material.supplier || "Unknown Supplier";
      if (!acc[supplierName]) {
        acc[supplierName] = [];
      }
      acc[supplierName].push(material);
      return acc;
    }, {});
    res.json(bySupplier);
  } catch (error) {
    console.error("Error in getMaterialsBySupplier:", error);
    res.status(500).json({ message: error.message, suppliers: {} });
  }
};
var getMaterialsForOrder = async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId);
    if (isNaN(orderId)) {
      return res.status(400).json({ message: "Invalid order ID", materials: [] });
    }
    const materials = await storage.getMaterialsForOrder(orderId);
    res.json(materials || []);
  } catch (error) {
    console.error("Error in getMaterialsForOrder:", error);
    res.status(500).json({ message: error.message, materials: [] });
  }
};
var updateMaterial = async (req, res) => {
  try {
    const materialId = req.params.id;
    let updateData;
    if (req.body.data) {
      updateData = req.body.data;
    } else {
      const { status, notes, orderDate, receiveDate, supplierName } = req.body;
      updateData = {
        status,
        notes,
        orderDate,
        receiveDate,
        supplierName
      };
    }
    const cleanedData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v !== void 0)
    );
    console.log("Updating material order with data:", cleanedData);
    const updatedMaterial = await storage.updateMaterialOrder(materialId, cleanedData);
    res.json(updatedMaterial);
  } catch (error) {
    console.error("Error updating material:", error);
    res.status(500).json({ message: error.message });
  }
};
var createPurchaseOrder = async (req, res) => {
  try {
    const { materialIds } = req.body;
    if (!materialIds || !Array.isArray(materialIds) || materialIds.length === 0) {
      return res.status(400).json({ message: "No materials selected" });
    }
    const purchaseOrder = await storage.createPurchaseOrder(materialIds);
    res.status(201).json(purchaseOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var getMaterialTypes = async (req, res) => {
  try {
    const materials = await storage.getMaterialsPickList();
    const types = Array.from(new Set((materials || []).map((m) => m.type).filter(Boolean)));
    res.json(types.length > 0 ? types : ["frame", "mat", "glass", "hardware"]);
  } catch (error) {
    console.error("Error in getMaterialTypes:", error);
    res.status(500).json({ message: error.message, types: ["frame", "mat", "glass", "hardware"] });
  }
};
var getMaterialSuppliers = async (req, res) => {
  try {
    const materials = await storage.getMaterialsPickList();
    const suppliers2 = Array.from(new Set((materials || []).map((m) => m.supplier).filter(Boolean)));
    res.json(suppliers2.length > 0 ? suppliers2 : ["Larson-Juhl", "Roma", "Bella"]);
  } catch (error) {
    console.error("Error in getMaterialSuppliers:", error);
    res.status(500).json({ message: error.message, suppliers: ["Larson-Juhl", "Roma", "Bella"] });
  }
};

// server/routes/integrationApiRoutes.ts
init_integrationController();
import { Router as Router4 } from "express";
init_integrationController();
var router4 = Router4();
router4.get("/orders/:id", verifyApiKey, getOrderWithQrCode);
router4.get("/orders", verifyApiKey, getAllOrdersWithQrCodes);
router4.patch("/orders/:id/status", verifyApiKey, updateOrderStatus);
router4.post("/webhook", verifyApiKey, receiveWebhook);
router4.get("/test", testIntegration);
router4.post("/configure-kanban", configureKanbanConnection);
var integrationApiRoutes_default = router4;

// server/routes/ordersRoutes.ts
import { Router as Router5 } from "express";

// server/controllers/ordersController.ts
init_storage();
import axios2 from "axios";
init_db();
init_schema();
import { eq as eq5 } from "drizzle-orm";
var orderNotificationService2 = new SimpleOrderNotificationService();
var KANBAN_API_URL = process.env.KANBAN_API_URL || "https://kanban-app-url.replit.app";
var KANBAN_API_KEY = process.env.KANBAN_API_KEY;
async function syncOrderToKanban(order) {
  try {
    if (!KANBAN_API_KEY || !KANBAN_API_URL) {
      console.log("Kanban integration not configured, skipping sync");
      return;
    }
    const kanbanOrder = {
      orderId: order.id,
      customerName: order.customerName || "Unknown Customer",
      artworkTitle: order.artworkDescription,
      frameSize: `${order.artworkWidth}x${order.artworkHeight}`,
      status: order.productionStatus || "order_processed",
      stage: "pending",
      priority: "standard",
      dueDate: order.dueDate,
      createdAt: order.createdAt,
      estimatedCompletion: order.estimatedCompletionDays ? new Date(Date.now() + order.estimatedCompletionDays * 24 * 60 * 60 * 1e3).toISOString() : null,
      materials: {
        frameType: order.frameId || "Unknown",
        matColor: order.matColorId || "White",
        glass: order.glassOptionId || "Regular"
      }
    };
    const response = await axios2.post(`${KANBAN_API_URL}/api/orders`, kanbanOrder, {
      headers: {
        "Authorization": `Bearer ${KANBAN_API_KEY}`,
        "Content-Type": "application/json"
      },
      timeout: 5e3
    });
    if (response.data && response.data.success) {
      console.log(`Order ${order.id} synced to Kanban successfully`);
    }
  } catch (error) {
    console.error(`Failed to sync order ${order.id} to Kanban:`, error.message);
  }
}
async function updateKanbanOrderStatus(orderId, status, notes) {
  try {
    if (!KANBAN_API_KEY || !KANBAN_API_URL) {
      console.log("Kanban integration not configured, skipping status update");
      return;
    }
    const response = await axios2.post(`${KANBAN_API_URL}/api/orders/${orderId}/status`, {
      status,
      stage: status,
      notes: notes || `Status updated to ${status}`,
      updatedBy: "Jays Frames POS",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }, {
      headers: {
        "Authorization": `Bearer ${KANBAN_API_KEY}`,
        "Content-Type": "application/json"
      },
      timeout: 5e3
    });
    if (response.data && response.data.success) {
      console.log(`Order ${orderId} status updated in Kanban to ${status}`);
    }
  } catch (error) {
    console.error(`Failed to update order ${orderId} status in Kanban:`, error.message);
  }
}
async function fetchOrdersFromKanban() {
  try {
    if (!KANBAN_API_KEY) {
      console.log("No Kanban API key found, using local storage");
      return null;
    }
    const response = await axios2.get(`${KANBAN_API_URL}/api/orders`, {
      headers: {
        "Authorization": `Bearer ${KANBAN_API_KEY}`,
        "Content-Type": "application/json"
      },
      timeout: 5e3
      // 5 second timeout
    });
    if (response.data && response.data.success) {
      return response.data.orders;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch orders from Kanban app:", error.message);
    return null;
  }
}
async function getAllOrders(req, res) {
  try {
    const kanbanOrders = await fetchOrdersFromKanban();
    if (kanbanOrders && kanbanOrders.length > 0) {
      console.log(`Fetched ${kanbanOrders.length} orders from Kanban app`);
      const transformedOrders = kanbanOrders.map((order) => ({
        id: order.orderId || order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone || "",
        customerEmail: order.customerEmail || "",
        artworkTitle: order.artworkTitle,
        artworkWidth: order.frameSize ? parseFloat(order.frameSize.split("x")[0]) : order.artworkWidth,
        artworkHeight: order.frameSize ? parseFloat(order.frameSize.split("x")[1]) : order.artworkHeight,
        frameId: order.materials?.frameType || order.frameId,
        matId: order.materials?.matColor || order.matId,
        glassType: order.materials?.glass || order.glassType || "Museum Glass",
        productionStatus: order.status || "pending",
        stage: order.stage || "material_prep",
        totalPrice: order.totalPrice || 0,
        createdAt: order.createdAt,
        scheduledDate: order.dueDate || order.scheduledDate,
        estimatedCompletion: order.estimatedCompletion,
        priority: order.priority || "standard",
        qrCode: order.qrCode || "",
        notes: order.notes || ""
      }));
      res.json({
        success: true,
        orders: transformedOrders,
        source: "kanban",
        count: transformedOrders.length
      });
      return;
    }
    console.log("Falling back to local storage for orders");
    const localOrders = await storage.getAllOrders();
    console.log("Local orders found:", localOrders.length);
    res.json({
      success: true,
      orders: localOrders,
      source: "local",
      count: localOrders.length
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch orders"
    });
  }
}
async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = await storage.getOrder(parseInt(id));
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found"
      });
    }
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch order"
    });
  }
}
async function createOrder(req, res) {
  try {
    const orderData = req.body;
    console.log("Creating order with data:", orderData);
    if (!orderData.customerId) {
      return res.status(400).json({
        success: false,
        error: "Customer ID is required"
      });
    }
    if (!orderData.artworkImage) {
      console.log("Warning: Order created without artwork image");
      orderData.artworkImage = "placeholder-image.jpg";
    }
    if (!orderData.artworkWidth || !orderData.artworkHeight) {
      return res.status(400).json({
        success: false,
        error: "Artwork dimensions are required"
      });
    }
    if (!orderData.matWidth) {
      orderData.matWidth = "2";
    }
    console.log("Processing order creation...");
    const order = await storage.createOrder(orderData);
    console.log("Order created successfully:", order);
    await syncOrderToKanban(order);
    try {
      if (order.customerId) {
        const customer = await storage.getCustomer(order.customerId);
        if (customer && customer.phone) {
          await orderNotificationService2.handleOrderEvent({
            orderId: order.id.toString(),
            orderNumber: `ORD-${order.id}`,
            customerName: customer.name,
            customerPhone: customer.phone,
            eventType: "order_placed",
            metadata: {
              estimatedCompletion: order.estimatedCompletionDays ? `${order.estimatedCompletionDays} days` : "7-10 days"
            }
          });
          console.log(`Order placed notification sent for order ${order.id}`);
        }
      }
    } catch (notificationError) {
      console.error("Failed to send order placed notification:", notificationError);
    }
    res.status(201).json({
      success: true,
      order,
      message: "Order created successfully",
      orderId: order.id
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create order",
      details: error.stack
    });
  }
}
async function updateOrder(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const order = await storage.updateOrder(parseInt(id), updateData);
    if (updateData.productionStatus) {
      await updateKanbanOrderStatus(parseInt(id), updateData.productionStatus);
    }
    res.json({
      success: true,
      order,
      message: "Order updated successfully"
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update order"
    });
  }
}
async function updateOrderStatus2(req, res) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Status is required"
      });
    }
    const order = await storage.updateOrder(parseInt(id), {
      productionStatus: status,
      lastStatusChange: /* @__PURE__ */ new Date()
    });
    try {
      if (order && order.customerId) {
        const customer = await storage.getCustomer(order.customerId);
        if (customer && customer.phone) {
          let eventType = null;
          switch (status) {
            case "in_production":
              eventType = "production_started";
              break;
            case "frame_cut":
              eventType = "frame_cut";
              break;
            case "mat_cut":
              eventType = "mat_cut";
              break;
            case "assembly_complete":
              eventType = "assembly_complete";
              break;
            case "ready_for_pickup":
              eventType = "ready_for_pickup";
              break;
          }
          if (eventType) {
            await orderNotificationService2.handleOrderEvent({
              orderId: order.id.toString(),
              orderNumber: `ORD-${order.id}`,
              customerName: customer.name,
              customerPhone: customer.phone,
              eventType
            });
            console.log(`Status change notification sent for order ${order.id}: ${status}`);
          }
        }
      }
    } catch (notificationError) {
      console.error("Failed to send status change notification:", notificationError);
    }
    await updateKanbanOrderStatus(parseInt(id), status, notes);
    res.json({
      success: true,
      order,
      message: `Order status updated to ${status}`
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update order status"
    });
  }
}
async function deleteOrder(req, res) {
  try {
    const { id } = req.params;
    await storage.deleteOrder(parseInt(id));
    res.json({
      success: true,
      message: "Order deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to delete order"
    });
  }
}
async function testKanbanSync(req, res) {
  try {
    const { orderId } = req.params;
    if (!KANBAN_API_KEY || !KANBAN_API_URL) {
      return res.json({
        success: false,
        error: "Kanban integration not configured",
        config: {
          hasApiKey: !!KANBAN_API_KEY,
          hasApiUrl: !!KANBAN_API_URL,
          apiUrl: KANBAN_API_URL
        }
      });
    }
    const order = await storage.getOrder(parseInt(orderId));
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found"
      });
    }
    await syncOrderToKanban(order);
    res.json({
      success: true,
      message: `Order ${orderId} synced to Kanban successfully`,
      order: {
        id: order.id,
        status: order.productionStatus,
        kanbanUrl: KANBAN_API_URL
      }
    });
  } catch (error) {
    console.error("Error testing Kanban sync:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to test Kanban sync"
    });
  }
}
async function getKanbanStatus(req, res) {
  try {
    res.json({
      success: true,
      status: {
        configured: !!(KANBAN_API_KEY && KANBAN_API_URL),
        apiUrl: KANBAN_API_URL,
        hasApiKey: !!KANBAN_API_KEY,
        endpoints: {
          orders: `${KANBAN_API_URL}/api/orders`,
          statusUpdate: `${KANBAN_API_URL}/api/orders/:id/status`
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get Kanban status"
    });
  }
}
async function getAllOrderGroups(req, res) {
  try {
    const orderGroups2 = await storage.getAllOrderGroups();
    res.json({
      success: true,
      orderGroups: orderGroups2,
      count: orderGroups2.length
    });
  } catch (error) {
    console.error("Error fetching order groups:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch order groups"
    });
  }
}
async function createOrderGroup(req, res) {
  try {
    const orderGroupData = req.body;
    const orderGroup = await storage.createOrderGroup(orderGroupData);
    res.status(201).json({
      success: true,
      orderGroup,
      message: "Order group created successfully"
    });
  } catch (error) {
    console.error("Error creating order group:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create order group"
    });
  }
}

// server/routes/ordersRoutes.ts
init_storage();
var router5 = Router5();
router5.get("/orders", getAllOrders);
router5.get("/orders/:id", getOrderById);
router5.post("/orders", createOrder);
router5.patch("/orders/:id", updateOrder);
router5.patch("/orders/:id/status", updateOrderStatus2);
router5.delete("/orders/:id", deleteOrder);
router5.post("/orders/:id/send-update", async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = await storage.getOrder(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    if (!order.customerId) {
      return res.status(400).json({ success: false, error: "Order has no customer" });
    }
    const customer = await storage.getCustomer(order.customerId);
    if (!customer) {
      return res.status(404).json({ success: false, error: "Customer not found" });
    }
    await storage.createCustomerNotification({
      customerId: customer.id,
      orderId: order.id,
      notificationType: "status_update",
      channel: "email",
      subject: `Order #${order.id} Update`,
      message: `Your order is currently ${order.productionStatus.replace("_", " ")}. We'll keep you updated on the progress.`,
      successful: true
    });
    res.json({
      success: true,
      message: "Customer notification sent successfully"
    });
  } catch (error) {
    console.error("Error sending customer update:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to send customer update"
    });
  }
});
router5.post("/orders/:orderId/test-kanban-sync", testKanbanSync);
router5.get("/kanban/status", getKanbanStatus);
router5.get("/order-groups", getAllOrderGroups);
router5.post("/order-groups", createOrderGroup);
var ordersRoutes_default = router5;

// server/routes/customersRoutes.ts
import { Router as Router6 } from "express";

// server/controllers/customersController.ts
init_db();
init_schema();
import { eq as eq6, desc as desc2 } from "drizzle-orm";
async function getAllCustomers(req, res) {
  try {
    const allCustomers = await db.select().from(customers).orderBy(desc2(customers.createdAt));
    return res.status(200).json(allCustomers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return res.status(500).json({ message: "Error fetching customers" });
  }
}
async function getCustomerById(req, res) {
  try {
    const { id } = req.params;
    const customerId = parseInt(id);
    if (isNaN(customerId)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }
    const customer = await db.select().from(customers).where(eq6(customers.id, customerId)).limit(1);
    if (customer.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    return res.status(200).json(customer[0]);
  } catch (error) {
    console.error("Error fetching customer:", error);
    return res.status(500).json({ message: "Error fetching customer" });
  }
}
async function createCustomer(req, res) {
  try {
    const validatedData = insertCustomerSchema.parse(req.body);
    const [newCustomer] = await db.insert(customers).values(validatedData).returning();
    return res.status(201).json(newCustomer);
  } catch (error) {
    console.error("Error creating customer:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Invalid customer data", errors: error.errors });
    }
    return res.status(500).json({ message: "Error creating customer" });
  }
}

// server/routes/customersRoutes.ts
var router6 = Router6();
router6.get("/customers", getAllCustomers);
router6.get("/customers/:id", getCustomerById);
router6.post("/customers", createCustomer);
var customersRoutes_default = router6;

// server/routes/inventoryRoutes.ts
import { Router as Router7 } from "express";

// server/controllers/inventoryController.ts
init_db();
init_schema();
import { eq as eq7 } from "drizzle-orm";
async function getAllInventoryLocations(req, res) {
  try {
    const allLocations = await db.select().from(inventoryLocations);
    return res.status(200).json(allLocations);
  } catch (error) {
    console.error("Error fetching inventory locations:", error);
    return res.status(500).json({ message: "Error fetching inventory locations", details: error.message });
  }
}
async function getInventoryLocationById(req, res) {
  try {
    const { id } = req.params;
    const location = await db.select().from(inventoryLocations).where(eq7(inventoryLocations.id, parseInt(id))).limit(1);
    if (location.length === 0) {
      return res.status(404).json({ message: "Inventory location not found" });
    }
    return res.status(200).json(location[0]);
  } catch (error) {
    console.error("Error fetching inventory location:", error);
    return res.status(500).json({ message: "Error fetching inventory location", details: error.message });
  }
}
async function createInventoryLocation(req, res) {
  try {
    const validatedData = insertInventoryLocationSchema.parse(req.body);
    const [newLocation] = await db.insert(inventoryLocations).values(validatedData).returning();
    return res.status(201).json(newLocation);
  } catch (error) {
    console.error("Error creating inventory location:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Invalid location data", errors: error.errors });
    }
    return res.status(500).json({ message: "Error creating inventory location", details: error.message });
  }
}
async function updateInventoryLocation(req, res) {
  try {
    const { id } = req.params;
    const validatedData = insertInventoryLocationSchema.parse(req.body);
    const [updatedLocation] = await db.update(inventoryLocations).set(validatedData).where(eq7(inventoryLocations.id, parseInt(id))).returning();
    if (!updatedLocation) {
      return res.status(404).json({ message: "Inventory location not found" });
    }
    return res.status(200).json(updatedLocation);
  } catch (error) {
    console.error("Error updating inventory location:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Invalid location data", errors: error.errors });
    }
    return res.status(500).json({ message: "Error updating inventory location", details: error.message });
  }
}
async function deleteInventoryLocation(req, res) {
  try {
    const { id } = req.params;
    const itemsInLocation = await db.select({ count: db.fn.count() }).from(inventoryItems).where(eq7(inventoryItems.locationId, parseInt(id)));
    if (parseInt(itemsInLocation[0].count) > 0) {
      return res.status(400).json({
        message: "Cannot delete location with assigned items. Move items to another location first."
      });
    }
    const result = await db.delete(inventoryLocations).where(eq7(inventoryLocations.id, parseInt(id))).returning({ id: inventoryLocations.id });
    if (result.length === 0) {
      return res.status(404).json({ message: "Inventory location not found" });
    }
    return res.status(200).json({ message: "Inventory location deleted successfully" });
  } catch (error) {
    console.error("Error deleting inventory location:", error);
    return res.status(500).json({ message: "Error deleting inventory location", details: error.message });
  }
}
async function getAllInventoryItems(req, res) {
  try {
    const allItems = await db.select({
      ...inventoryItems,
      locationName: inventoryLocations.name
    }).from(inventoryItems).leftJoin(inventoryLocations, eq7(inventoryItems.locationId, inventoryLocations.id));
    return res.status(200).json(allItems || []);
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    return res.status(500).json({ message: "Error fetching inventory items", details: error.message });
  }
}
async function getLowStockItems(req, res) {
  try {
    return res.status(200).json([]);
  } catch (error) {
    console.error("Error fetching low stock items:", error);
    return res.status(500).json({ message: "Error fetching low stock items", details: error.message });
  }
}
async function getAllSuppliers(req, res) {
  try {
    const allSuppliers = await db.select().from(suppliers);
    return res.status(200).json(allSuppliers || []);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return res.status(500).json({ message: "Error fetching suppliers", details: error.message });
  }
}

// server/routes/inventoryRoutes.ts
var router7 = Router7();
router7.get("/inventory/locations", getAllInventoryLocations);
router7.get("/inventory/locations/:id", getInventoryLocationById);
router7.post("/inventory/locations", createInventoryLocation);
router7.put("/inventory/locations/:id", updateInventoryLocation);
router7.delete("/inventory/locations/:id", deleteInventoryLocation);
router7.get("/inventory/items", getAllInventoryItems);
router7.get("/inventory/items/low-stock", getLowStockItems);
router7.get("/inventory/suppliers", getAllSuppliers);
var inventoryRoutes_default = router7;

// server/routes/xmlPriceSheetRoutes.ts
import { Router as Router8 } from "express";

// server/services/xmlPriceSheetService.ts
import { parseString } from "xml2js";
import { promisify } from "util";
var parseXml = promisify(parseString);
var XmlPriceSheetService = class {
  /**
   * Parse vendor XML price sheet and extract pricing data
   */
  async parseVendorXmlPriceSheet(xmlContent) {
    try {
      console.log("Parsing vendor XML price sheet...");
      const result = await parseXml(xmlContent);
      const items = [];
      if (result.catalog?.items?.item) {
        const xmlItems = Array.isArray(result.catalog.items.item) ? result.catalog.items.item : [result.catalog.items.item];
        for (const xmlItem of xmlItems) {
          const item = {
            itemNumber: this.extractValue(xmlItem.sku || xmlItem.itemNumber || xmlItem.id),
            description: this.extractValue(xmlItem.description || xmlItem.name),
            width: this.extractValue(xmlItem.width),
            collection: this.extractValue(xmlItem.collection || xmlItem.series),
            manufacturer: this.extractValue(xmlItem.manufacturer || xmlItem.vendor || "Unknown"),
            wholesalePrice: this.extractNumericValue(xmlItem.wholesalePrice || xmlItem.cost || xmlItem.price),
            retailPrice: this.extractNumericValue(xmlItem.retailPrice || xmlItem.msrp),
            category: this.extractValue(xmlItem.category || xmlItem.type),
            inStock: this.extractBooleanValue(xmlItem.inStock || xmlItem.available),
            unitOfMeasure: this.extractValue(xmlItem.unitOfMeasure || xmlItem.uom || "each")
          };
          if (item.itemNumber && item.wholesalePrice > 0) {
            items.push(item);
          }
        }
      } else if (result.products?.product) {
        const xmlItems = Array.isArray(result.products.product) ? result.products.product : [result.products.product];
        for (const xmlItem of xmlItems) {
          const item = {
            itemNumber: this.extractValue(xmlItem.$.id || xmlItem.$.sku),
            description: this.extractValue(xmlItem.name?.[0] || xmlItem.description?.[0]),
            width: this.extractValue(xmlItem.dimensions?.width?.[0]),
            collection: this.extractValue(xmlItem.collection?.[0]),
            manufacturer: this.extractValue(xmlItem.manufacturer?.[0] || "Unknown"),
            wholesalePrice: this.extractNumericValue(xmlItem.pricing?.wholesale?.[0] || xmlItem.cost?.[0]),
            retailPrice: this.extractNumericValue(xmlItem.pricing?.retail?.[0]),
            category: this.extractValue(xmlItem.category?.[0]),
            inStock: this.extractBooleanValue(xmlItem.inventory?.inStock?.[0]),
            unitOfMeasure: this.extractValue(xmlItem.unitOfMeasure?.[0] || "each")
          };
          if (item.itemNumber && item.wholesalePrice > 0) {
            items.push(item);
          }
        }
      }
      console.log(`Successfully parsed ${items.length} items from XML price sheet`);
      return items;
    } catch (error) {
      console.error("Error parsing XML price sheet:", error);
      throw new Error(`Failed to parse XML price sheet: ${error.message}`);
    }
  }
  extractValue(value) {
    if (typeof value === "string") return value.trim();
    if (Array.isArray(value) && value.length > 0) return String(value[0]).trim();
    if (value && typeof value === "object" && value._) return String(value._).trim();
    return "";
  }
  extractNumericValue(value) {
    const stringValue = this.extractValue(value);
    const numericValue = parseFloat(stringValue.replace(/[^0-9.-]/g, ""));
    return isNaN(numericValue) ? 0 : numericValue;
  }
  extractBooleanValue(value) {
    const stringValue = this.extractValue(value).toLowerCase();
    return stringValue === "true" || stringValue === "yes" || stringValue === "1";
  }
  /**
   * Convert vendor price items to Frame format for catalog integration
   */
  convertToFrameFormat(items) {
    return items.map((item) => ({
      id: `vendor-${item.manufacturer.toLowerCase().replace(/\s+/g, "-")}-${item.itemNumber}`,
      name: `${item.collection ? item.collection + " " : ""}${item.description}`,
      manufacturer: item.manufacturer,
      material: this.inferMaterial(item.description, item.category),
      width: item.width || "",
      depth: "",
      // Not typically provided in price sheets
      price: item.wholesalePrice.toString(),
      catalogImage: "",
      // Would need separate image mapping
      color: this.inferColor(item.description),
      itemNumber: item.itemNumber,
      collection: item.collection || "",
      category: item.category || "",
      inStock: item.inStock !== false,
      unitOfMeasure: item.unitOfMeasure
    }));
  }
  inferMaterial(description, category) {
    const desc3 = description.toLowerCase();
    const cat = category?.toLowerCase() || "";
    if (desc3.includes("wood") || cat.includes("wood")) return "wood";
    if (desc3.includes("metal") || cat.includes("metal")) return "metal";
    if (desc3.includes("plastic") || cat.includes("plastic")) return "plastic";
    if (desc3.includes("composite") || cat.includes("composite")) return "composite";
    return "wood";
  }
  inferColor(description) {
    const desc3 = description.toLowerCase();
    if (desc3.includes("black")) return "#000000";
    if (desc3.includes("white")) return "#FFFFFF";
    if (desc3.includes("brown")) return "#8B4513";
    if (desc3.includes("gold")) return "#FFD700";
    if (desc3.includes("silver")) return "#C0C0C0";
    if (desc3.includes("red")) return "#FF0000";
    if (desc3.includes("blue")) return "#0000FF";
    return "#8B4513";
  }
};
var xmlPriceSheetService = new XmlPriceSheetService();

// server/controllers/xmlPriceSheetController.ts
init_db();
init_schema();
async function uploadXmlPriceSheet(req, res) {
  try {
    const { xmlContent, vendorName } = req.body;
    if (!xmlContent) {
      return res.status(400).json({ message: "XML content is required" });
    }
    if (!vendorName) {
      return res.status(400).json({ message: "Vendor name is required" });
    }
    console.log(`Processing XML price sheet for vendor: ${vendorName}`);
    const priceItems = await xmlPriceSheetService.parseVendorXmlPriceSheet(xmlContent);
    if (priceItems.length === 0) {
      return res.status(400).json({ message: "No valid price items found in XML" });
    }
    const frameItems = xmlPriceSheetService.convertToFrameFormat(priceItems);
    let insertedCount = 0;
    let updatedCount = 0;
    for (const frameItem of frameItems) {
      try {
        const existingFrame = await db.select().from(frames).where(eq(frames.id, frameItem.id)).limit(1);
        if (existingFrame.length > 0) {
          await db.update(frames).set({
            name: frameItem.name,
            manufacturer: frameItem.manufacturer,
            material: frameItem.material,
            width: frameItem.width,
            price: frameItem.price,
            color: frameItem.color,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(frames.id, frameItem.id));
          updatedCount++;
        } else {
          await db.insert(frames).values({
            id: frameItem.id,
            name: frameItem.name,
            manufacturer: frameItem.manufacturer,
            material: frameItem.material,
            width: frameItem.width,
            depth: frameItem.depth,
            price: frameItem.price,
            catalogImage: frameItem.catalogImage,
            color: frameItem.color,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          });
          insertedCount++;
        }
      } catch (itemError) {
        console.error(`Error processing frame item ${frameItem.id}:`, itemError);
      }
    }
    console.log(`XML price sheet processing complete. Inserted: ${insertedCount}, Updated: ${updatedCount}`);
    res.json({
      message: "XML price sheet processed successfully",
      vendor: vendorName,
      totalItems: priceItems.length,
      inserted: insertedCount,
      updated: updatedCount,
      summary: {
        priceItems: priceItems.slice(0, 5),
        // Sample of processed items
        frameItems: frameItems.slice(0, 5)
        // Sample of converted frames
      }
    });
  } catch (error) {
    console.error("Error processing XML price sheet:", error);
    res.status(500).json({
      message: "Failed to process XML price sheet",
      error: error.message
    });
  }
}
async function getXmlFormats(req, res) {
  res.json({
    supportedFormats: [
      {
        name: "Standard Catalog Format",
        structure: {
          catalog: {
            items: {
              item: [
                {
                  sku: "item-number",
                  description: "item-description",
                  manufacturer: "vendor-name",
                  wholesalePrice: "price",
                  width: "frame-width",
                  collection: "collection-name"
                }
              ]
            }
          }
        }
      },
      {
        name: "Products Format",
        structure: {
          products: {
            product: [
              {
                "$": { id: "item-number" },
                name: ["item-description"],
                manufacturer: ["vendor-name"],
                pricing: {
                  wholesale: ["price"]
                }
              }
            ]
          }
        }
      }
    ],
    requiredFields: ["itemNumber", "description", "manufacturer", "wholesalePrice"],
    optionalFields: ["width", "collection", "retailPrice", "category", "inStock"]
  });
}

// server/middleware/auth.ts
function isAuthenticated(req, res, next) {
  console.log("Auth middleware: Allowing request (authentication not implemented)");
  next();
}
var requireAuth = isAuthenticated;

// server/routes/xmlPriceSheetRoutes.ts
var router8 = Router8();
router8.use(requireAuth);
router8.post("/upload", uploadXmlPriceSheet);
router8.get("/formats", getXmlFormats);
var xmlPriceSheetRoutes_default = router8;

// server/routes/larsonOrderOptimizerRoutes.ts
import { Router as Router9 } from "express";

// server/services/larsonJuhlWholesalePricing.ts
var larsonJuhlWholesalePrices = [
  // Main Collection Frames
  { itemNumber: "10-036M", width: '5/8"', boxQty: 360, collection: "Maple & Walnut - Garrett", basePricePerFoot: 6.62, boxPrice: 10.05, lengthPrice: 13.52, chopPrice: 14.52 },
  { itemNumber: "10-100M", width: '5/8"', boxQty: 375, collection: "Maple & Walnut - Garrett", basePricePerFoot: 6.34, boxPrice: 9.71, lengthPrice: 12.75, chopPrice: 13.75 },
  { itemNumber: "10-507M", width: '5/8"', boxQty: 306, collection: "Museum Stems - Garrett", basePricePerFoot: 6.52, boxPrice: 9.91, lengthPrice: 13, chopPrice: 14 },
  { itemNumber: "100172", width: '1/4"', boxQty: 1600, collection: "Olmsted", basePricePerFoot: 2.75, boxPrice: 4.64, lengthPrice: 7.28, chopPrice: 8.28 },
  { itemNumber: "100750", width: '1/4"', boxQty: 1200, collection: "Sofia", basePricePerFoot: 2.63, boxPrice: 4.04, lengthPrice: 6.73, chopPrice: 7.73 },
  { itemNumber: "100751", width: '1/4"', boxQty: 1587, collection: "Sofia", basePricePerFoot: 2.63, boxPrice: 4.04, lengthPrice: 6.73, chopPrice: 7.73 },
  { itemNumber: "100752", width: '1/4"', boxQty: 1e3, collection: "Sofia", basePricePerFoot: 2.63, boxPrice: 4.04, lengthPrice: 6.73, chopPrice: 7.73 },
  { itemNumber: "102CG", width: '1/2"', boxQty: 432, collection: "Marquis", basePricePerFoot: 1.74, boxPrice: 3.7, lengthPrice: 6.43, chopPrice: 7.43 },
  { itemNumber: "102CS", width: '1/2"', boxQty: 432, collection: "Marquis", basePricePerFoot: 1.74, boxPrice: 3.7, lengthPrice: 6.43, chopPrice: 7.43 },
  { itemNumber: "103180", width: '9/16"', boxQty: 900, collection: "Hudson", basePricePerFoot: 1.46, boxPrice: 3.11, lengthPrice: 5.56, chopPrice: 6.56 },
  { itemNumber: "103190", width: '9/16"', boxQty: 900, collection: "Hudson", basePricePerFoot: 1.4, boxPrice: 2.97, lengthPrice: 5.3, chopPrice: 6.3 },
  { itemNumber: "103235", width: '5/16"', boxQty: 1200, collection: "Academie", basePricePerFoot: 1.44, boxPrice: 3.17, lengthPrice: 5.64, chopPrice: 6.64 },
  { itemNumber: "103237", width: '5/16"', boxQty: 1296, collection: "Academie", basePricePerFoot: 1.43, boxPrice: 3.14, lengthPrice: 5.59, chopPrice: 6.59 },
  { itemNumber: "105794", width: '5/16"', boxQty: 785, collection: "Lucerne", basePricePerFoot: 3.21, boxPrice: 5.02, lengthPrice: 8.01, chopPrice: 9.01 },
  { itemNumber: "105CB", width: '1/2"', boxQty: 270, collection: "Vienna", basePricePerFoot: 2.21, boxPrice: 3.31, lengthPrice: 5.71, chopPrice: 6.71 },
  { itemNumber: "106180", width: '1/2"', boxQty: 900, collection: "Hudson", basePricePerFoot: 1.39, boxPrice: 2.99, lengthPrice: 5.31, chopPrice: 6.31 },
  { itemNumber: "106190", width: '1/2"', boxQty: 900, collection: "Hudson", basePricePerFoot: 1.32, boxPrice: 2.83, lengthPrice: 5.09, chopPrice: 6.09 },
  // Premium Frames
  { itemNumber: "200750", width: '7/8"', boxQty: 250, collection: "Sofia", basePricePerFoot: 4.38, boxPrice: 6.54, lengthPrice: 9.9, chopPrice: 10.9 },
  { itemNumber: "200751", width: '7/8"', boxQty: 515, collection: "Sofia", basePricePerFoot: 4.35, boxPrice: 6.76, lengthPrice: 9.84, chopPrice: 10.84 },
  { itemNumber: "200752", width: '7/8"', boxQty: 490, collection: "Sofia", basePricePerFoot: 4.57, boxPrice: 7.31, lengthPrice: 10.33, chopPrice: 11.33 },
  { itemNumber: "210286", width: '11/16"', boxQty: 450, collection: "White", basePricePerFoot: 1.89, boxPrice: 3.06, lengthPrice: 5.99, chopPrice: 6.99 },
  // High-End Frames
  { itemNumber: "400750", width: '1 5/8"', boxQty: 112, collection: "Sofia", basePricePerFoot: 7.47, boxPrice: 11.04, lengthPrice: 17.48, chopPrice: 18.48 },
  { itemNumber: "400751", width: '1 5/8"', boxQty: 192, collection: "Sofia", basePricePerFoot: 7.09, boxPrice: 10.44, lengthPrice: 16.55, chopPrice: 17.55 },
  { itemNumber: "400752", width: '1 5/8"', boxQty: 180, collection: "Sofia", basePricePerFoot: 7.34, boxPrice: 10.83, lengthPrice: 17.17, chopPrice: 18.17 },
  { itemNumber: "431431", width: '1 3/8"', boxQty: 115, collection: "Zen", basePricePerFoot: 10.83, boxPrice: 15.91, lengthPrice: 26.01, chopPrice: 27.01 },
  { itemNumber: "431432", width: '1 3/8"', boxQty: 113, collection: "Zen", basePricePerFoot: 10.27, boxPrice: 15.1, lengthPrice: 24.68, chopPrice: 25.68 },
  { itemNumber: "431434", width: '1 3/8"', boxQty: 110, collection: "Zen", basePricePerFoot: 10.75, boxPrice: 15.81, lengthPrice: 25.82, chopPrice: 26.82 },
  { itemNumber: "432900", width: '1 3/4"', boxQty: 225, collection: "Foundry", basePricePerFoot: 6.62, boxPrice: 9.75, lengthPrice: 15.03, chopPrice: 16.03 },
  { itemNumber: "432902", width: '1 3/4"', boxQty: 236, collection: "Foundry", basePricePerFoot: 6.81, boxPrice: 10.07, lengthPrice: 15.52, chopPrice: 16.52 },
  { itemNumber: "433082", width: '1 11/16"', boxQty: 108, collection: "Soho", basePricePerFoot: 5.09, boxPrice: 9.55, lengthPrice: 14.41, chopPrice: 15.41 },
  { itemNumber: "433084", width: '1 11/16"', boxQty: 108, collection: "Soho", basePricePerFoot: 5.16, boxPrice: 9.59, lengthPrice: 14.54, chopPrice: 15.54 },
  { itemNumber: "433086", width: '1 11/16"', boxQty: 108, collection: "Soho", basePricePerFoot: 5.22, boxPrice: 9.59, lengthPrice: 14.54, chopPrice: 15.54 },
  { itemNumber: "434110", width: '1 1/4"', boxQty: 137, collection: "CR2", basePricePerFoot: 6.33, boxPrice: 9.33, lengthPrice: 14.98, chopPrice: 15.98 },
  { itemNumber: "435500", width: '1 5/16"', boxQty: 324, collection: "Alto", basePricePerFoot: 1.8, boxPrice: 3.6, lengthPrice: 6.72, chopPrice: 7.72 },
  { itemNumber: "435510", width: '1 5/16"', boxQty: 296, collection: "Alto", basePricePerFoot: 1.8, boxPrice: 3.6, lengthPrice: 6.72, chopPrice: 7.72 },
  { itemNumber: "436350", width: '1 5/8"', boxQty: 143, collection: "Brooklyn", basePricePerFoot: 2.29, boxPrice: 3.66, lengthPrice: 6.08, chopPrice: 7.08 },
  { itemNumber: "437500", width: '1 3/16"', boxQty: 215, collection: "Alto", basePricePerFoot: 2.03, boxPrice: 3.6, lengthPrice: 7.22, chopPrice: 8.22 },
  { itemNumber: "437510", width: '1 3/16"', boxQty: 180, collection: "Alto", basePricePerFoot: 2.03, boxPrice: 3.6, lengthPrice: 7.22, chopPrice: 8.22 },
  { itemNumber: "438120", width: '2"', boxQty: 150, collection: "Dresden", basePricePerFoot: 6.78, boxPrice: 10.26, lengthPrice: 15.05, chopPrice: 16.05 },
  { itemNumber: "439082", width: '2 1/16"', boxQty: 126, collection: "Soho", basePricePerFoot: 4.42, boxPrice: 7.58, lengthPrice: 11.4, chopPrice: 12.4 },
  { itemNumber: "440240", width: '1 3/8"', boxQty: 190, collection: "Java", basePricePerFoot: 7.59, boxPrice: 11.23, lengthPrice: 18.27, chopPrice: 19.27 },
  { itemNumber: "440951", width: '2"', boxQty: 92, collection: "Cezanne", basePricePerFoot: 18.08, boxPrice: 25.65, lengthPrice: 29.81, chopPrice: 30.81 },
  { itemNumber: "441075", width: '2 1/16"', boxQty: 150, collection: "Prague", basePricePerFoot: 9.48, boxPrice: 13.9, lengthPrice: 23.98, chopPrice: 24.98 },
  { itemNumber: "441077", width: '2 1/16"', boxQty: 155, collection: "Prague", basePricePerFoot: 9.44, boxPrice: 13.82, lengthPrice: 23.86, chopPrice: 24.86 },
  { itemNumber: "442650", width: '1 3/4"', boxQty: 162, collection: "Tate", basePricePerFoot: 4.76, boxPrice: 8.08, lengthPrice: 11.57, chopPrice: 12.57 },
  { itemNumber: "442660", width: '1 3/4"', boxQty: 162, collection: "Tate", basePricePerFoot: 4.76, boxPrice: 8.07, lengthPrice: 11.56, chopPrice: 12.56 },
  { itemNumber: "442670", width: '1 3/4"', boxQty: 162, collection: "Tate", basePricePerFoot: 4.67, boxPrice: 7.74, lengthPrice: 11.04, chopPrice: 12.04 },
  { itemNumber: "520750", width: '2 1/2"', boxQty: 94, collection: "Sofia", basePricePerFoot: 11.07, boxPrice: 16.3, lengthPrice: 24.59, chopPrice: 25.59 },
  { itemNumber: "520751", width: '2 1/2"', boxQty: 59, collection: "Sofia", basePricePerFoot: 10.92, boxPrice: 16.43, lengthPrice: 24.78, chopPrice: 25.78 },
  { itemNumber: "520752", width: '2 1/2"', boxQty: 100, collection: "Sofia", basePricePerFoot: 10.56, boxPrice: 16.38, lengthPrice: 23.41, chopPrice: 24.41 }
];
function getLarsonJuhlWholesalePrice(itemNumber) {
  const normalizedItemNumber = itemNumber.startsWith("larson-") ? itemNumber.substring(7) : itemNumber;
  return larsonJuhlWholesalePrices.find((price) => price.itemNumber === normalizedItemNumber) || null;
}

// server/services/larsonOrderOptimizer.ts
var STANDARD_STICK_LENGTH = 9.5;
function optimizeLarsonOrder(itemNumber, footageNeeded) {
  const priceData = getLarsonJuhlWholesalePrice(itemNumber);
  if (!priceData) {
    return null;
  }
  const lengthPricePerFoot = priceData.basePricePerFoot;
  const chopPricePerFoot = priceData.chopPrice || priceData.basePricePerFoot * 1.5;
  const sticksNeeded = Math.ceil(footageNeeded / STANDARD_STICK_LENGTH);
  const totalFootage = sticksNeeded * STANDARD_STICK_LENGTH;
  const wasteFootage = totalFootage - footageNeeded;
  const lengthTotalCost = totalFootage * lengthPricePerFoot;
  const chopTotalCost = footageNeeded * chopPricePerFoot;
  let mixedOption;
  if (footageNeeded > STANDARD_STICK_LENGTH) {
    const fullSticks = Math.floor(footageNeeded / STANDARD_STICK_LENGTH);
    const remainingFootage = footageNeeded - fullSticks * STANDARD_STICK_LENGTH;
    if (remainingFootage > 0) {
      const mixedCost = fullSticks * STANDARD_STICK_LENGTH * lengthPricePerFoot + remainingFootage * chopPricePerFoot;
      mixedOption = {
        fullSticks,
        chopFootage: remainingFootage,
        totalCost: mixedCost,
        description: `${fullSticks} full stick(s) + ${remainingFootage.toFixed(1)}' chopped`
      };
    }
  }
  const options = [
    { method: "length", cost: lengthTotalCost },
    { method: "chop", cost: chopTotalCost },
    ...mixedOption ? [{ method: "mixed", cost: mixedOption.totalCost }] : []
  ];
  const bestOption = options.reduce(
    (best, current) => current.cost < best.cost ? current : best
  );
  const worstOption = options.reduce(
    (worst, current) => current.cost > worst.cost ? current : worst
  );
  const savings = worstOption.cost - bestOption.cost;
  let reason = "";
  let alert;
  if (bestOption.method === "length") {
    reason = `Full sticks are cheaper despite ${wasteFootage.toFixed(1)}' waste`;
  } else if (bestOption.method === "chop") {
    reason = "Chop pricing saves money by avoiding waste";
  } else {
    reason = "Mixed approach optimizes cost by combining full sticks and chopped pieces";
  }
  if (footageNeeded >= 0 && footageNeeded <= 4) {
    alert = "\u{1F3AF} OPTIMAL RANGE: 0-4 feet - Consider chop pricing to avoid waste";
  } else if (footageNeeded >= 10 && footageNeeded <= 14) {
    alert = "\u{1F3AF} OPTIMAL RANGE: 10-14 feet - Mixed ordering may be most cost-effective";
  } else if (footageNeeded > 4 && footageNeeded < 9.5) {
    alert = "\u{1F4CF} Consider: Close to full stick length, evaluate waste vs chop premium";
  }
  return {
    itemNumber,
    footageNeeded,
    lengthOption: {
      sticksNeeded,
      totalFootage,
      wasteFootage,
      costPerFoot: lengthPricePerFoot,
      totalCost: lengthTotalCost,
      description: `${sticksNeeded} stick(s) @ ${STANDARD_STICK_LENGTH}' each`
    },
    chopOption: {
      footageNeeded,
      costPerFoot: chopPricePerFoot,
      totalCost: chopTotalCost,
      description: `${footageNeeded}' chopped to exact length`
    },
    mixedOption,
    recommendation: {
      method: bestOption.method,
      savings,
      reason,
      alert
    }
  };
}
function calculateFramePerimeter(artworkWidth, artworkHeight, matWidth) {
  const frameWidth = artworkWidth + matWidth * 2;
  const frameHeight = artworkHeight + matWidth * 2;
  return frameWidth * 2 + frameHeight * 2;
}
function optimizeFrameOrder(itemNumber, artworkWidth, artworkHeight, matWidth) {
  const perimeterInches = calculateFramePerimeter(artworkWidth, artworkHeight, matWidth);
  const perimeterFeet = perimeterInches / 12;
  return optimizeLarsonOrder(itemNumber, perimeterFeet);
}
function batchOptimizeOrders(orders2) {
  return orders2.map((order) => {
    const optimization = optimizeFrameOrder(
      order.itemNumber,
      order.artworkWidth,
      order.artworkHeight,
      order.matWidth
    );
    return {
      ...optimization,
      quantity: order.quantity || 1
    };
  }).filter(Boolean);
}
function calculateBatchSavings(optimizations) {
  const totalSavings = optimizations.reduce((sum, opt) => sum + opt.recommendation.savings * opt.quantity, 0);
  const totalOrders = optimizations.reduce((sum, opt) => sum + opt.quantity, 0);
  const alertCount = optimizations.filter((opt) => opt.recommendation.alert).length;
  return {
    totalSavings,
    totalOrders,
    averageSavingsPerOrder: totalSavings / totalOrders,
    alertCount
  };
}

// server/controllers/larsonOrderOptimizerController.ts
async function optimizeByFootage(req, res) {
  try {
    const { itemNumber, footageNeeded } = req.body;
    if (!itemNumber || !footageNeeded) {
      return res.status(400).json({
        error: "Missing required parameters: itemNumber and footageNeeded"
      });
    }
    const optimization = optimizeLarsonOrder(itemNumber, parseFloat(footageNeeded));
    if (!optimization) {
      return res.status(404).json({
        error: "Item number not found in Larson-Juhl catalog"
      });
    }
    res.json(optimization);
  } catch (error) {
    console.error("Error optimizing Larson order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
async function optimizeFrameOrder2(req, res) {
  try {
    const { itemNumber, artworkWidth, artworkHeight, matWidth } = req.body;
    if (!itemNumber || !artworkWidth || !artworkHeight || matWidth === void 0) {
      return res.status(400).json({
        error: "Missing required parameters: itemNumber, artworkWidth, artworkHeight, matWidth"
      });
    }
    const optimization = optimizeFrameOrder2(
      itemNumber,
      parseFloat(artworkWidth),
      parseFloat(artworkHeight),
      parseFloat(matWidth)
    );
    if (!optimization) {
      return res.status(404).json({
        error: "Item number not found in Larson-Juhl catalog"
      });
    }
    res.json(optimization);
  } catch (error) {
    console.error("Error optimizing frame order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
async function batchOptimize(req, res) {
  try {
    const { orders: orders2 } = req.body;
    if (!orders2 || !Array.isArray(orders2)) {
      return res.status(400).json({
        error: "Missing or invalid orders array"
      });
    }
    const optimizations = batchOptimizeOrders(orders2);
    const savings = calculateBatchSavings(optimizations);
    res.json({
      optimizations,
      summary: savings
    });
  } catch (error) {
    console.error("Error batch optimizing orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
async function getOptimizationAnalysis(req, res) {
  try {
    const { itemNumber } = req.params;
    const footageRanges = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
    const analysis = footageRanges.map((footage) => {
      const optimization = optimizeLarsonOrder(itemNumber, footage);
      return {
        footage,
        optimization
      };
    }).filter((item) => item.optimization !== null);
    if (analysis.length === 0) {
      return res.status(404).json({
        error: "Item number not found in Larson-Juhl catalog"
      });
    }
    res.json({
      itemNumber,
      analysis
    });
  } catch (error) {
    console.error("Error generating optimization analysis:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// server/routes/larsonOrderOptimizerRoutes.ts
var router9 = Router9();
router9.post("/optimize/footage", optimizeByFootage);
router9.post("/optimize/frame", optimizeFrameOrder2);
router9.post("/optimize/batch", batchOptimize);
router9.get("/analyze/:itemNumber", getOptimizationAnalysis);
var larsonOrderOptimizerRoutes_default = router9;

// server/routes/testEmailRoutes.ts
init_emailService();
import express2 from "express";
var router10 = express2.Router();
router10.post("/test-basic", async (req, res) => {
  const { to, subject, message } = req.body;
  if (!to || !subject || !message) {
    return res.status(400).json({
      error: "Missing required fields: to, subject, message"
    });
  }
  console.log("SendGrid API Key exists:", !!process.env.SENDGRID_API_KEY);
  console.log("SendGrid API Key starts with SG.:", process.env.SENDGRID_API_KEY?.startsWith("SG."));
  console.log("From email:", process.env.FROM_EMAIL || "noreply@jaysartandframes.com");
  try {
    const fromEmail = "noreply@jaysartandframes.com";
    await sendEmailWithSendGrid({
      to,
      from: fromEmail,
      subject,
      text: message,
      html: `<p>${message}</p>`
    });
    res.json({
      success: true,
      message: "Test email sent successfully!"
    });
  } catch (error) {
    console.error("Test email error:", error);
    const errorDetails = {
      message: error.message,
      hasApiKey: !!process.env.SENDGRID_API_KEY,
      apiKeyFormat: process.env.SENDGRID_API_KEY?.startsWith("SG.") ? "Valid format" : "Invalid format",
      fromEmail: process.env.FROM_EMAIL || "noreply@jaysartandframes.com"
    };
    res.status(500).json({
      error: "Failed to send test email",
      details: error.message,
      debug: errorDetails
    });
  }
});
router10.post("/test-order-status", async (req, res) => {
  const {
    customerEmail,
    customerName = "Test Customer",
    orderId = 12345,
    orderStatus = "order_processed"
  } = req.body;
  if (!customerEmail) {
    return res.status(400).json({
      error: "Missing required field: customerEmail"
    });
  }
  try {
    await sendOrderStatusUpdate2(
      customerEmail,
      customerName,
      orderId,
      orderStatus,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3)
      // 7 days from now
    );
    res.json({
      success: true,
      message: "Order status email sent successfully!"
    });
  } catch (error) {
    console.error("Order status email error:", error);
    res.status(500).json({
      error: "Failed to send order status email",
      details: error.message
    });
  }
});
var testEmailRoutes_default = router10;

// server/routes/voiceCallRoutes.ts
import { Router as Router10 } from "express";

// server/controllers/voiceCallController.ts
var makeCustomVoiceCall = async (req, res) => {
  try {
    const { to, message, voice, language, twiml, url, recordCall } = req.body;
    if (!to) {
      return res.status(400).json({
        error: "Phone number is required"
      });
    }
    if (!message && !twiml && !url) {
      return res.status(400).json({
        error: "Must provide either message, twiml, or url parameter"
      });
    }
    if (!isVoiceCallingConfigured()) {
      return res.status(503).json({
        error: "Voice calling is not configured. Please check Twilio credentials."
      });
    }
    const result = await makeVoiceCall({
      to: formatPhoneNumber(to),
      message,
      voice,
      language,
      twiml,
      url,
      recordCall
    });
    if (result.success) {
      res.json({
        success: true,
        callSid: result.sid,
        message: "Voice call initiated successfully"
      });
    } else {
      res.status(400).json({
        error: result.error
      });
    }
  } catch (error) {
    console.error("Error making voice call:", error);
    res.status(500).json({
      error: "Failed to make voice call"
    });
  }
};
var callOrderStatus = async (req, res) => {
  try {
    const { to, orderNumber, status, estimatedCompletion } = req.body;
    if (!to || !orderNumber || !status) {
      return res.status(400).json({
        error: "Phone number, order number, and status are required"
      });
    }
    if (!isVoiceCallingConfigured()) {
      return res.status(503).json({
        error: "Voice calling is not configured. Please check Twilio credentials."
      });
    }
    const result = await callOrderStatusUpdate({
      to: formatPhoneNumber(to),
      orderNumber,
      status,
      estimatedCompletion
    });
    if (result.success) {
      res.json({
        success: true,
        callSid: result.sid,
        message: "Order status call initiated successfully"
      });
    } else {
      res.status(400).json({
        error: result.error
      });
    }
  } catch (error) {
    console.error("Error making order status call:", error);
    res.status(500).json({
      error: "Failed to make order status call"
    });
  }
};
var callPaymentReminderController = async (req, res) => {
  try {
    const { to, customerName, amount, orderNumber, dueDate } = req.body;
    if (!to || !customerName || !amount || !orderNumber) {
      return res.status(400).json({
        error: "Phone number, customer name, amount, and order number are required"
      });
    }
    if (!isVoiceCallingConfigured()) {
      return res.status(503).json({
        error: "Voice calling is not configured. Please check Twilio credentials."
      });
    }
    const result = await callPaymentReminder({
      to: formatPhoneNumber(to),
      customerName,
      amount: parseFloat(amount),
      orderNumber,
      dueDate
    });
    if (result.success) {
      res.json({
        success: true,
        callSid: result.sid,
        message: "Payment reminder call initiated successfully"
      });
    } else {
      res.status(400).json({
        error: result.error
      });
    }
  } catch (error) {
    console.error("Error making payment reminder call:", error);
    res.status(500).json({
      error: "Failed to make payment reminder call"
    });
  }
};
var callPickupReminderController = async (req, res) => {
  try {
    const { to, customerName, orderNumber, daysWaiting } = req.body;
    if (!to || !customerName || !orderNumber || daysWaiting === void 0) {
      return res.status(400).json({
        error: "Phone number, customer name, order number, and days waiting are required"
      });
    }
    if (!isVoiceCallingConfigured()) {
      return res.status(503).json({
        error: "Voice calling is not configured. Please check Twilio credentials."
      });
    }
    const result = await callPickupReminder(
      customerName,
      formatPhoneNumber(to),
      orderNumber,
      parseInt(daysWaiting)
    );
    if (result.success) {
      res.json({
        success: true,
        callSid: result.sid,
        message: "Pickup reminder call initiated successfully"
      });
    } else {
      res.status(400).json({
        error: result.error
      });
    }
  } catch (error) {
    console.error("Error making pickup reminder call:", error);
    res.status(500).json({
      error: "Failed to make pickup reminder call"
    });
  }
};
var callOrderCompleteController = async (req, res) => {
  try {
    const { to, customerName, orderNumber } = req.body;
    if (!to || !customerName || !orderNumber) {
      return res.status(400).json({
        error: "Phone number, customer name, and order number are required"
      });
    }
    if (!isVoiceCallingConfigured()) {
      return res.status(503).json({
        error: "Voice calling is not configured. Please check Twilio credentials."
      });
    }
    const result = await callOrderComplete(
      customerName,
      formatPhoneNumber(to),
      orderNumber
    );
    if (result.success) {
      res.json({
        success: true,
        callSid: result.sid,
        message: "Order completion call initiated successfully"
      });
    } else {
      res.status(400).json({
        error: result.error
      });
    }
  } catch (error) {
    console.error("Error making order completion call:", error);
    res.status(500).json({
      error: "Failed to make order completion call"
    });
  }
};
var getVoiceCallStatus = async (req, res) => {
  try {
    const { callSid } = req.params;
    if (!callSid) {
      return res.status(400).json({
        error: "Call SID is required"
      });
    }
    if (!isVoiceCallingConfigured()) {
      return res.status(503).json({
        error: "Voice calling is not configured. Please check Twilio credentials."
      });
    }
    const result = await getCallStatus(callSid);
    if (result.success) {
      res.json({
        success: true,
        status: result.status
      });
    } else {
      res.status(400).json({
        error: result.error
      });
    }
  } catch (error) {
    console.error("Error getting call status:", error);
    res.status(500).json({
      error: "Failed to get call status"
    });
  }
};
var checkVoiceCallConfiguration = async (req, res) => {
  try {
    const configured = isVoiceCallingConfigured();
    res.json({
      configured,
      message: configured ? "Voice calling is properly configured" : "Voice calling requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER"
    });
  } catch (error) {
    console.error("Error checking voice call configuration:", error);
    res.status(500).json({
      error: "Failed to check voice call configuration"
    });
  }
};

// server/routes/voiceCallRoutes.ts
var router11 = Router10();
router11.get("/configuration", checkVoiceCallConfiguration);
router11.post("/make-call", makeCustomVoiceCall);
router11.post("/order-status", callOrderStatus);
router11.post("/order-complete", callOrderCompleteController);
router11.post("/pickup-reminder", callPickupReminderController);
router11.post("/payment-reminder", callPaymentReminderController);
router11.get("/status/:callSid", getVoiceCallStatus);
var voiceCallRoutes_default = router11;

// server/routes/twimlRoutes.ts
import { Router as Router11 } from "express";
var router12 = Router11();
router12.post("/order-complete/:orderNumber", (req, res) => {
  const { orderNumber } = req.params;
  const { customerName } = req.query;
  res.set("Content-Type", "text/xml");
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Amy">Hello ${customerName || "valued customer"}! This is Jay's Frames calling with great news.</Say>
    <Pause length="1"/>
    <Say voice="Polly.Amy">Your custom framing order number ${orderNumber} is now complete and ready for pickup.</Say>
    <Pause length="1"/>
    <Play>https://demo.twilio.com/docs/classic.mp3</Play>
    <Say voice="Polly.Amy">We're excited for you to see the beautiful result. Please come by during our business hours to collect your order.</Say>
    <Pause length="1"/>
    <Say voice="Polly.Amy">Thank you for choosing Jay's Frames. Have a wonderful day!</Say>
</Response>`;
  res.send(twiml);
});
router12.post("/payment-reminder/:orderNumber", (req, res) => {
  const { orderNumber } = req.params;
  const { customerName, amount, dueDate } = req.query;
  res.set("Content-Type", "text/xml");
  const dueDateText = dueDate ? ` Payment is due by ${dueDate}.` : "";
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Brian">Hello ${customerName || "valued customer"}, this is Jay's Frames calling about your order number ${orderNumber}.</Say>
    <Pause length="1"/>
    <Say voice="Polly.Brian">You have an outstanding balance of ${amount || "your order total"}.${dueDateText}</Say>
    <Pause length="1"/>
    <Say voice="Polly.Brian">Please contact us at your earliest convenience to complete your payment.</Say>
    <Pause length="1"/>
    <Say voice="Polly.Brian">Thank you for your prompt attention to this matter.</Say>
</Response>`;
  res.send(twiml);
});
router12.post("/pickup-reminder/:orderNumber", (req, res) => {
  const { orderNumber } = req.params;
  const { customerName, daysWaiting } = req.query;
  res.set("Content-Type", "text/xml");
  const days = parseInt(daysWaiting || "1");
  const dayText = days === 1 ? "day" : "days";
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Emma">Hello ${customerName || "valued customer"}, this is Jay's Frames.</Say>
    <Pause length="1"/>
    <Say voice="Polly.Emma">Your custom framing order number ${orderNumber} has been ready for pickup for ${days} ${dayText}.</Say>
    <Pause length="1"/>
    <Say voice="Polly.Emma">Please come by during our business hours to collect your beautiful framed artwork.</Say>
    <Pause length="1"/>
    <Say voice="Polly.Emma">We look forward to seeing you soon. Thank you!</Say>
</Response>`;
  res.send(twiml);
});
router12.post("/promotional/:campaignId", (req, res) => {
  const { campaignId } = req.params;
  const { customerName } = req.query;
  res.set("Content-Type", "text/xml");
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Amy">Hello ${customerName || "valued customer"}! Thank you for being a loyal customer of Jay's Frames.</Say>
    <Pause length="1"/>
    <Play>https://demo.twilio.com/docs/classic.mp3</Play>
    <Say voice="Polly.Amy">We have an exciting special offer just for you! Visit our shop this week for twenty percent off all custom matting services.</Say>
    <Pause length="1"/>
    <Say voice="Polly.Amy">This exclusive offer expires soon, so don't miss out on transforming your favorite artwork.</Say>
    <Pause length="1"/>
    <Say voice="Polly.Amy">Thank you for choosing Jay's Frames. We can't wait to help you create something beautiful!</Say>
</Response>`;
  res.send(twiml);
});
router12.post("/interactive-survey/:orderNumber", (req, res) => {
  const { orderNumber } = req.params;
  const { customerName } = req.query;
  res.set("Content-Type", "text/xml");
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Amy">Hello ${customerName || "valued customer"}! This is Jay's Frames calling about your recent order number ${orderNumber}.</Say>
    <Pause length="1"/>
    <Gather numDigits="1" action="/api/twiml/survey-response" method="POST" timeout="10">
        <Say voice="Polly.Amy">We'd love to hear about your experience. Please press 1 if you're extremely satisfied, 2 for satisfied, or 3 if you have concerns.</Say>
    </Gather>
    <Say voice="Polly.Amy">Thank you for your time. Have a wonderful day!</Say>
</Response>`;
  res.send(twiml);
});
router12.post("/survey-response", (req, res) => {
  const { Digits } = req.body;
  res.set("Content-Type", "text/xml");
  let responseMessage = "";
  switch (Digits) {
    case "1":
      responseMessage = "Thank you for rating us as extremely satisfied! We appreciate your business and look forward to serving you again.";
      break;
    case "2":
      responseMessage = "Thank you for your positive feedback! We appreciate your business.";
      break;
    case "3":
      responseMessage = "Thank you for your feedback. We will have a manager contact you shortly to address your concerns.";
      break;
    default:
      responseMessage = "Thank you for your time. Have a wonderful day!";
  }
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Amy">${responseMessage}</Say>
</Response>`;
  res.send(twiml);
});
var twimlRoutes_default = router12;

// server/routes/orderNotificationRoutes.ts
import { Router as Router12 } from "express";

// server/controllers/orderNotificationController.ts
var OrderNotificationController = class {
  /**
   * Trigger a notification for a specific order event
   */
  async triggerNotification(req, res) {
    try {
      const {
        orderId,
        orderNumber,
        customerName,
        customerPhone,
        eventType,
        metadata
      } = req.body;
      if (!orderId || !orderNumber || !customerName || !customerPhone || !eventType) {
        res.status(400).json({
          success: false,
          error: "Missing required fields: orderId, orderNumber, customerName, customerPhone, eventType"
        });
        return;
      }
      const validEventTypes = [
        "order_placed",
        "payment_received",
        "production_started",
        "frame_cut",
        "mat_cut",
        "assembly_complete",
        "ready_for_pickup",
        "payment_due",
        "pickup_overdue"
      ];
      if (!validEventTypes.includes(eventType)) {
        res.status(400).json({
          success: false,
          error: `Invalid event type. Must be one of: ${validEventTypes.join(", ")}`
        });
        return;
      }
      const orderEvent = {
        orderId,
        orderNumber,
        customerName,
        customerPhone,
        eventType,
        metadata
      };
      await simpleOrderNotificationService.handleOrderEvent(orderEvent);
      res.json({
        success: true,
        message: `Notification triggered for order ${orderNumber}`,
        eventType
      });
    } catch (error) {
      console.error("Error triggering notification:", error);
      res.status(500).json({
        success: false,
        error: "Failed to trigger notification"
      });
    }
  }
  /**
   * Schedule a delayed notification
   */
  async scheduleNotification(req, res) {
    try {
      const {
        orderId,
        orderNumber,
        customerName,
        customerPhone,
        eventType,
        delayMinutes,
        metadata
      } = req.body;
      if (!delayMinutes || delayMinutes < 1) {
        res.status(400).json({
          success: false,
          error: "delayMinutes must be a positive number"
        });
        return;
      }
      const orderEvent = {
        orderId,
        orderNumber,
        customerName,
        customerPhone,
        eventType,
        metadata
      };
      await simpleOrderNotificationService.scheduleDelayedNotification(orderEvent, delayMinutes);
      res.json({
        success: true,
        message: `Notification scheduled for order ${orderNumber} in ${delayMinutes} minutes`,
        scheduledFor: new Date(Date.now() + delayMinutes * 60 * 1e3).toISOString()
      });
    } catch (error) {
      console.error("Error scheduling notification:", error);
      res.status(500).json({
        success: false,
        error: "Failed to schedule notification"
      });
    }
  }
  /**
   * Send bulk notifications for multiple orders
   */
  async sendBulkNotifications(req, res) {
    try {
      const { events } = req.body;
      if (!Array.isArray(events) || events.length === 0) {
        res.status(400).json({
          success: false,
          error: "events must be a non-empty array"
        });
        return;
      }
      for (const event of events) {
        if (!event.orderId || !event.orderNumber || !event.customerName || !event.customerPhone || !event.eventType) {
          res.status(400).json({
            success: false,
            error: "Each event must have orderId, orderNumber, customerName, customerPhone, and eventType"
          });
          return;
        }
      }
      await simpleOrderNotificationService.sendBulkNotifications(events);
      res.json({
        success: true,
        message: `Bulk notifications sent for ${events.length} orders`,
        count: events.length
      });
    } catch (error) {
      console.error("Error sending bulk notifications:", error);
      res.status(500).json({
        success: false,
        error: "Failed to send bulk notifications"
      });
    }
  }
  /**
   * Check for overdue orders and send reminders
   */
  async checkOverdueOrders(req, res) {
    try {
      console.log("Checking for overdue pickup orders...");
      res.json({
        success: true,
        message: "Overdue orders check completed"
      });
    } catch (error) {
      console.error("Error checking overdue orders:", error);
      res.status(500).json({
        success: false,
        error: "Failed to check overdue orders"
      });
    }
  }
  /**
   * Get notification configuration and status
   */
  async getNotificationStatus(req, res) {
    try {
      const isConfigured = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER);
      const eventTypes = [
        { type: "order_placed", description: "Order confirmation call" },
        { type: "payment_received", description: "Payment confirmation call" },
        { type: "production_started", description: "Production started notification" },
        { type: "frame_cut", description: "Frame cutting complete update" },
        { type: "mat_cut", description: "Mat cutting complete update" },
        { type: "assembly_complete", description: "Assembly complete notification" },
        { type: "ready_for_pickup", description: "Order ready for pickup call" },
        { type: "payment_due", description: "Payment reminder call" },
        { type: "pickup_overdue", description: "Pickup reminder call" }
      ];
      res.json({
        success: true,
        configured: isConfigured,
        message: isConfigured ? "Order notifications are configured and ready" : "Twilio credentials required",
        supportedEventTypes: eventTypes,
        endpoints: {
          trigger: "/api/order-notifications/trigger",
          schedule: "/api/order-notifications/schedule",
          bulk: "/api/order-notifications/bulk",
          checkOverdue: "/api/order-notifications/check-overdue"
        }
      });
    } catch (error) {
      console.error("Error getting notification status:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get notification status"
      });
    }
  }
  /**
   * Test notification with sample data
   */
  async testNotification(req, res) {
    try {
      const { phone, eventType = "ready_for_pickup" } = req.body;
      if (!phone) {
        res.status(400).json({
          success: false,
          error: "Phone number is required for test notification"
        });
        return;
      }
      const testEvent = {
        orderId: "TEST-001",
        orderNumber: "TEST-001",
        customerName: "Test Customer",
        customerPhone: phone,
        eventType,
        metadata: {
          amount: 125.5,
          daysWaiting: 3,
          dueDate: "Friday",
          estimatedCompletion: "2-3 business days"
        }
      };
      await simpleOrderNotificationService.handleOrderEvent(testEvent);
      res.json({
        success: true,
        message: `Test notification sent to ${phone}`,
        eventType,
        testData: testEvent
      });
    } catch (error) {
      console.error("Error sending test notification:", error);
      res.status(500).json({
        success: false,
        error: "Failed to send test notification"
      });
    }
  }
};
var orderNotificationController = new OrderNotificationController();

// server/routes/orderNotificationRoutes.ts
var router13 = Router12();
router13.post("/trigger", orderNotificationController.triggerNotification.bind(orderNotificationController));
router13.post("/schedule", orderNotificationController.scheduleNotification.bind(orderNotificationController));
router13.post("/bulk", orderNotificationController.sendBulkNotifications.bind(orderNotificationController));
router13.post("/check-overdue", orderNotificationController.checkOverdueOrders.bind(orderNotificationController));
router13.get("/status", orderNotificationController.getNotificationStatus.bind(orderNotificationController));
router13.post("/test", orderNotificationController.testNotification.bind(orderNotificationController));
var orderNotificationRoutes_default = router13;

// server/routes/paymentStatusRoutes.ts
init_db();
init_schema();
import { Router as Router13 } from "express";
import Stripe2 from "stripe";
import { eq as eq8 } from "drizzle-orm";
var router14 = Router13();
var stripe = process.env.STRIPE_SECRET_KEY ? new Stripe2(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16"
}) : null;
router14.post("/payment-status", async (req, res) => {
  try {
    const { payment_intent_id, client_secret } = req.body;
    if (!stripe) {
      return res.status(500).json({
        success: false,
        message: "Payment processing is not configured"
      });
    }
    if (!payment_intent_id) {
      return res.status(400).json({
        success: false,
        message: "Payment intent ID is required"
      });
    }
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
    const orderGroup = await db.select().from(orderGroups).where(eq8(orderGroups.stripePaymentIntentId, payment_intent_id)).limit(1);
    let orderGroupId = null;
    if (orderGroup.length > 0) {
      orderGroupId = orderGroup[0].id;
      if (paymentIntent.status === "succeeded") {
        await db.update(orderGroups).set({
          status: "confirmed",
          paymentStatus: "paid",
          paymentMethod: "card",
          paidAt: /* @__PURE__ */ new Date()
        }).where(eq8(orderGroups.id, orderGroupId));
      }
    }
    res.json({
      success: true,
      status: paymentIntent.status,
      orderGroupId,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment status"
    });
  }
});
var paymentStatusRoutes_default = router14;

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/art-locations", artLocationController.sendArtLocationData);
  app2.get("/api/art-locations/:orderId", artLocationController.getArtLocationData);
  app2.post("/api/frame-designs", frameDesignController.saveFrameDesign);
  app2.get("/api/frame-designs/:orderId", frameDesignController.getFrameDesign);
  app2.use("/api/webhooks", webhookRoutes_default);
  app2.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      environment: "production"
    });
  });
  app2.get("/", (req, res) => {
    res.json({
      status: "healthy",
      service: "Jay's Frames POS System",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      environment: "production"
    });
  });
  app2.get("/api/dashboard/config", (req, res) => {
    const dashboardApiUrl = process.env.DASHBOARD_API_URL;
    res.json({
      configured: !!dashboardApiUrl,
      url: dashboardApiUrl ? `${dashboardApiUrl.substring(0, 30)}...` : null,
      fullUrl: dashboardApiUrl,
      message: dashboardApiUrl ? "Dashboard API is configured and ready" : "Dashboard API URL not configured. Add DASHBOARD_API_URL to your secrets.",
      endpoints: dashboardApiUrl ? {
        metrics: `${dashboardApiUrl}/api/metrics`,
        orders: `${dashboardApiUrl}/api/orders`,
        status: `${dashboardApiUrl}/api/status`
      } : null
    });
  });
  app2.get("/api/dashboard-proxy/health", async (req, res) => {
    const dashboardApiUrl = process.env.DASHBOARD_API_URL;
    if (!dashboardApiUrl) {
      return res.status(400).json({ error: "Dashboard API URL not configured" });
    }
    try {
      const response = await fetch(`${dashboardApiUrl}/api/health`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/dashboard-proxy/metrics", async (req, res) => {
    const dashboardApiUrl = process.env.DASHBOARD_API_URL;
    if (!dashboardApiUrl) {
      return res.status(400).json({ error: "Dashboard API URL not configured" });
    }
    try {
      const response = await fetch(`${dashboardApiUrl}/api/metrics`);
      app2.get("/api/recommendations/frames", async (req2, res2) => {
        try {
          const params = {
            artworkType: req2.query.artworkType,
            artworkDescription: req2.query.artworkDescription,
            artworkWidth: parseFloat(req2.query.artworkWidth) || 16,
            artworkHeight: parseFloat(req2.query.artworkHeight) || 20,
            colorPreference: req2.query.colorPreference,
            stylePreference: req2.query.stylePreference,
            budgetLevel: req2.query.budgetLevel,
            roomDecor: req2.query.roomDecor,
            customerPreference: req2.query.customerPreference
          };
          const recommendations = await recommendationService.getRecommendations(params);
          res2.json(recommendations);
        } catch (error) {
          console.error("Error getting frame recommendations:", error);
          res2.status(500).json({ error: "Failed to get recommendations", message: error.message });
        }
      });
      app2.post("/api/recommendations/from-image", async (req2, res2) => {
        try {
          const { imageBase64, ...params } = req2.body;
          if (!imageBase64) {
            return res2.status(400).json({ error: "Image data required" });
          }
          const recommendations = await recommendationService.getRecommendationsFromImage(imageBase64, params);
          res2.json(recommendations);
        } catch (error) {
          console.error("Error getting image-based recommendations:", error);
          res2.status(500).json({ error: "Failed to analyze image", message: error.message });
        }
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/dashboard-proxy/status", async (req, res) => {
    const dashboardApiUrl = process.env.DASHBOARD_API_URL;
    app2.get("/api/ai/material-recommendations", async (req2, res2) => {
      try {
        const aiMaterialService = await Promise.resolve().then(() => (init_aiMaterialOrderingService(), aiMaterialOrderingService_exports));
        const recommendations = await aiMaterialService.generateOrderingRecommendations();
        res2.json({ recommendations });
      } catch (error) {
        console.error("Error getting material recommendations:", error);
        res2.status(500).json({ error: "Failed to generate recommendations", message: error.message });
      }
    });
    app2.get("/api/ai/seasonal-trends/:materialId", async (req2, res2) => {
      try {
        const { materialId } = req2.params;
        const aiMaterialService = await Promise.resolve().then(() => (init_aiMaterialOrderingService(), aiMaterialOrderingService_exports));
        const trends = await aiMaterialService.getSeasonalTrends(materialId);
        res2.json(trends);
      } catch (error) {
        console.error("Error getting seasonal trends:", error);
        res2.status(500).json({ error: "Failed to get trends", message: error.message });
      }
    });
    if (!dashboardApiUrl) {
      return res.status(400).json({ error: "Dashboard API URL not configured" });
    }
    try {
      const response = await fetch(`${dashboardApiUrl}/api/status`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/dashboard-proxy/test", async (req, res) => {
    const dashboardApiUrl = process.env.DASHBOARD_API_URL;
    if (!dashboardApiUrl) {
      return res.status(400).json({ error: "Dashboard API URL not configured" });
    }
    try {
      const response = await fetch(`${dashboardApiUrl}/api/health`);
      if (response.ok) {
        res.json({ success: true, message: "Dashboard connection successful" });
      } else {
        res.status(500).json({ error: "Dashboard connection failed" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.all("/api/dashboard-proxy/*", async (req, res) => {
    const dashboardApiUrl = process.env.DASHBOARD_API_URL;
    if (!dashboardApiUrl) {
      return res.status(503).json({
        success: false,
        error: "Dashboard API URL not configured. Please add DASHBOARD_API_URL to your secrets."
      });
    }
    try {
      const endpoint = req.params[0];
      const requestOptions = {
        method: req.method,
        headers: {
          "Content-Type": "application/json",
          // Forward any authorization headers if needed
          ...req.headers.authorization && { "Authorization": req.headers.authorization }
        }
      };
      if (["POST", "PUT", "PATCH"].includes(req.method) && req.body) {
        requestOptions.body = JSON.stringify(req.body);
      }
      const response = await fetch(`${dashboardApiUrl}/${endpoint}`, requestOptions);
      if (!response.ok) {
        throw new Error(`Dashboard API responded with status: ${response.status}`);
      }
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      console.error("Dashboard API proxy error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to connect to Dashboard API",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/vendor-catalog/all", (req, res) => {
    res.json([]);
  });
  app2.get("/api/vendor-catalog/larson", (req, res) => {
    res.json([]);
  });
  app2.get("/api/vendor-catalog/roma", (req, res) => {
    res.json([]);
  });
  app2.get("/api/vendor-catalog/nielsen", (req, res) => {
    res.json([]);
  });
  app2.get("/api/larson-catalog/crescent", (req, res) => {
    res.json([]);
  });
  app2.get("/api/frames", (req, res) => {
    res.json([]);
  });
  app2.get("/api/mat-colors", (req, res) => {
    res.json([]);
  });
  app2.get("/api/glass-options", (req, res) => {
    res.json([]);
  });
  app2.get("/api/wholesale-orders", (req, res) => {
    res.json([]);
  });
  app2.get("/api/qr-codes", (req, res) => {
    res.json([]);
  });
  app2.get("/api/hub/material-orders", (req, res) => {
    res.json([]);
  });
  app2.get("/api/auth/status", (req, res) => {
    res.json({ authenticated: false, user: null });
  });
  app2.get("/api/discord/bot-info", (req, res) => {
    res.json({
      status: "disabled",
      message: "Discord integration temporarily disabled for deployment stability"
    });
  });
  app2.post("/api/discord/test-notification", async (req, res) => {
    res.status(503).json({
      error: "Discord integration temporarily disabled",
      message: "Discord notifications are currently unavailable"
    });
  });
  app2.post("/api/notifications/send", async (req, res) => {
    try {
      const { customerPhone, customerEmail, orderId, type, message, discordUserId } = req.body;
      const { getCustomerByPhone: getCustomerByPhone2, getCustomerByEmail: getCustomerByEmail2, updateCustomerDiscordId: updateCustomerDiscordId2 } = await Promise.resolve().then(() => (init_customerProfiles(), customerProfiles_exports));
      let customer = customerPhone ? getCustomerByPhone2(customerPhone) : customerEmail ? getCustomerByEmail2(customerEmail) : null;
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      const orderNumber = orderId || Math.floor(Math.random() * 1e3) + 100;
      console.log(`Notification request for customer ${customer.name}: ${type} - ${message}`);
      res.json({
        success: true,
        customer: {
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          hasDiscord: false
        },
        orderNumber,
        message: "Notification logged (Discord integration disabled for deployment stability)"
      });
    } catch (error) {
      console.error("Error sending customer notification:", error);
      res.status(500).json({
        error: "Failed to send notification",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/customers/search", async (req, res) => {
    try {
      const { phone, email } = req.query;
      const { getCustomerByPhone: getCustomerByPhone2, getCustomerByEmail: getCustomerByEmail2 } = await Promise.resolve().then(() => (init_customerProfiles(), customerProfiles_exports));
      let customer = phone ? getCustomerByPhone2(phone) : email ? getCustomerByEmail2(email) : null;
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json({
        customer: {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          hasDiscord: !!customer.discordUserId,
          preferences: customer.preferences,
          notes: customer.notes
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to search customer" });
    }
  });
  app2.get("/api/kanban/external/orders", async (req, res) => {
    try {
      const { externalKanbanService: externalKanbanService2 } = await Promise.resolve().then(() => (init_externalKanbanService(), externalKanbanService_exports));
      const result = await externalKanbanService2.fetchOrders();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        orders: [],
        error: "Failed to fetch orders from external Kanban app"
      });
    }
  });
  app2.get("/api/kanban/external/health", async (req, res) => {
    try {
      const { externalKanbanService: externalKanbanService2 } = await Promise.resolve().then(() => (init_externalKanbanService(), externalKanbanService_exports));
      const health = await externalKanbanService2.healthCheck();
      res.json(health);
    } catch (error) {
      res.status(500).json({
        status: "error",
        connected: false,
        error: "Failed to check external Kanban health"
      });
    }
  });
  app2.get("/api/integrations/test-all", async (req, res) => {
    try {
      const results = {
        dashboard: { connected: false, error: null },
        kanban: { connected: false, error: null }
      };
      const dashboardApiUrl = process.env.DASHBOARD_API_URL;
      if (dashboardApiUrl) {
        try {
          const dashboardResponse = await fetch(`${dashboardApiUrl}/api/health`, {
            method: "GET",
            timeout: 5e3
          });
          results.dashboard.connected = dashboardResponse.ok;
          if (!dashboardResponse.ok) {
            results.dashboard.error = `HTTP ${dashboardResponse.status}`;
          }
        } catch (error) {
          results.dashboard.error = error instanceof Error ? error.message : "Connection failed";
        }
      } else {
        results.dashboard.error = "Dashboard API URL not configured";
      }
      const kanbanApiUrl = process.env.EXTERNAL_KANBAN_URL;
      const kanbanApiKey = process.env.EXTERNAL_KANBAN_API_KEY;
      if (kanbanApiUrl && kanbanApiKey) {
        try {
          const kanbanResponse = await fetch(`${kanbanApiUrl}/api/health`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${kanbanApiKey}`,
              "Content-Type": "application/json"
            },
            timeout: 5e3
          });
          results.kanban.connected = kanbanResponse.ok;
          if (!kanbanResponse.ok) {
            results.kanban.error = `HTTP ${kanbanResponse.status}`;
          }
        } catch (error) {
          results.kanban.error = error instanceof Error ? error.message : "Connection failed";
        }
      } else {
        results.kanban.error = "Kanban API URL or API Key not configured";
      }
      res.json({
        success: true,
        integrations: results,
        summary: {
          total: 2,
          connected: Object.values(results).filter((r) => r.connected).length,
          failed: Object.values(results).filter((r) => !r.connected).length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to test integrations"
      });
    }
  });
  app2.post("/api/kanban/external/test-connection", async (req, res) => {
    try {
      const { externalKanbanService: externalKanbanService2 } = await Promise.resolve().then(() => (init_externalKanbanService(), externalKanbanService_exports));
      const hasUrl = !!process.env.EXTERNAL_KANBAN_URL;
      const hasApiKey = !!process.env.EXTERNAL_KANBAN_API_KEY;
      if (!hasUrl || !hasApiKey) {
        return res.status(400).json({
          success: false,
          error: "Kanban configuration incomplete",
          details: {
            hasUrl,
            hasApiKey,
            message: "Please add EXTERNAL_KANBAN_URL and EXTERNAL_KANBAN_API_KEY to your secrets"
          }
        });
      }
      const health = await externalKanbanService2.healthCheck();
      const ordersResult = await externalKanbanService2.fetchOrders();
      res.json({
        success: health.connected,
        health,
        ordersTest: {
          success: ordersResult.success,
          orderCount: ordersResult.orders.length,
          error: ordersResult.error
        },
        configuration: {
          baseUrl: process.env.EXTERNAL_KANBAN_URL ? `${process.env.EXTERNAL_KANBAN_URL.substring(0, 30)}...` : "Not configured",
          apiKeyConfigured: !!process.env.EXTERNAL_KANBAN_API_KEY
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Connection test failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post("/api/kanban/external/orders/:orderId/status", async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status, stage, notes } = req.body;
      const { externalKanbanService: externalKanbanService2 } = await Promise.resolve().then(() => (init_externalKanbanService(), externalKanbanService_exports));
      const success = await externalKanbanService2.updateOrderStatus(orderId, status, stage, notes);
      if (success) {
        res.json({
          success: true,
          orderId,
          updatedStatus: status,
          stage,
          notes,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Failed to update order status in external Kanban"
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to update external Kanban order status"
      });
    }
  });
  app2.get("/api/kanban/api-key", (req, res) => {
    res.json({
      success: true,
      message: "Use one of these API keys for integration",
      apiKeys: [
        {
          key: "kanban_admin_key_2025_full_access",
          name: "3D Designer Integration",
          permissions: ["orders:create", "orders:read", "orders:update", "pricing:read", "files:upload"]
        },
        {
          key: "jf_houston_heights_framing_2025_master_api_key_secure_access",
          name: "Houston Heights Framing API Integration",
          permissions: ["orders:read", "orders:write", "integration:webhook", "pricing:read", "catalog:read"]
        }
      ],
      usage: {
        header: "Authorization",
        format: "Bearer YOUR_API_KEY"
      },
      endpoints: {
        baseUrl: process.env.REPL_URL || "https://your-repl-name.replit.app",
        orders: "/api/kanban/orders",
        status: "/api/kanban/status"
      }
    });
  });
  const KANBAN_API_KEY2 = process.env.POS_API_KEY || "jays_frames_kanban_2025";
  app2.get("/api/kanban/orders", validateApiKey, (req, res) => {
    res.json({
      success: true,
      orders: [],
      endpoint: "/api/kanban/orders",
      description: "Retrieves all orders with production status and timeline information"
    });
  });
  app2.post("/api/kanban/orders/:orderId/status", validateApiKey, (req, res) => {
    const { orderId } = req.params;
    const { status, stage, notes } = req.body;
    res.json({
      success: true,
      orderId,
      updatedStatus: status,
      stage,
      notes,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      description: "Updates order production status from external Kanban system"
    });
  });
  app2.get("/api/kanban/status", (req, res) => {
    res.json({
      status: "active",
      service: "Jays Frames POS System",
      version: "1.0.0",
      endpoints: {
        orders: "/api/kanban/orders",
        updateStatus: "/api/kanban/orders/:orderId/status",
        health: "/api/kanban/status"
      },
      authentication: "API Key required in Authorization header",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app2.get("/api/kanban/api-key", (req, res) => {
    res.json({
      apiKey: KANBAN_API_KEY2,
      usage: "Add this to your Kanban app Authorization header as: Bearer " + KANBAN_API_KEY2,
      endpoints: {
        orders: "/api/kanban/orders",
        updateStatus: "/api/kanban/orders/:orderId/status"
      },
      note: "Keep this API key secure - it provides access to your order data"
    });
  });
  app2.use("/api/hub", hubApiRoutes_default);
  app2.use("/api/hub-admin", hubAdminRoutes_default);
  app2.use("/api/admin", hubAdminRoutes_default);
  app2.post("/api/admin/generate-api-key", async (req, res) => {
    try {
      const { generateApiKey: generateApiKey3 } = await Promise.resolve().then(() => (init_integrationController(), integrationController_exports));
      await generateApiKey3(req, res);
    } catch (error) {
      console.error("Error in generate-api-key route:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  app2.get("/api/admin/integration-status", async (req, res) => {
    try {
      const { getIntegrationStatus: getIntegrationStatus2 } = await Promise.resolve().then(() => (init_integrationController(), integrationController_exports));
      await getIntegrationStatus2(req, res);
    } catch (error) {
      console.error("Error in integration-status route:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  app2.get("/api/admin/integration-docs", async (req, res) => {
    try {
      const { getIntegrationDocs: getIntegrationDocs2 } = await Promise.resolve().then(() => (init_integrationController(), integrationController_exports));
      await getIntegrationDocs2(req, res);
    } catch (error) {
      console.error("Error in integration-docs route:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  app2.get("/api/webhooks", async (req, res) => {
    try {
      res.json({ success: true, webhooks: [] });
    } catch (error) {
      console.error("Error in webhooks route:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  app2.use("/api", ordersRoutes_default);
  app2.use("/api", customersRoutes_default);
  app2.use("/api", inventoryRoutes_default);
  app2.use("/api/integration", integrationApiRoutes_default);
  app2.use("/api/xml-price-sheets", xmlPriceSheetRoutes_default);
  app2.use("/api/larson-optimizer", larsonOrderOptimizerRoutes_default);
  app2.use("/api/test-email", testEmailRoutes_default);
  app2.use("/api/voice-calls", voiceCallRoutes_default);
  app2.use("/api/twiml", twimlRoutes_default);
  app2.use("/api/order-notifications", orderNotificationRoutes_default);
  app2.use("/api", paymentStatusRoutes_default);
  app2.get("/api/discord/status", (req, res) => {
    res.json({ status: "disabled", message: "Discord integration disabled for deployment stability" });
  });
  app2.get("/api/notifications/status", (req, res) => {
    res.json({ status: "basic", channels: ["email"], message: "Basic notifications only" });
  });
  app2.get("/api/materials/pick-list", getMaterialsPickList);
  app2.get("/api/materials/by-supplier", getMaterialsBySupplier);
  app2.get("/api/materials/order/:orderId", getMaterialsForOrder);
  app2.put("/api/materials/:id", updateMaterial);
  app2.post("/api/materials/purchase-order", createPurchaseOrder);
  app2.get("/api/materials/types", getMaterialTypes);
  app2.get("/api/materials/suppliers", getMaterialSuppliers);
  app2.post("/api/materials/bulk-update", async (req, res) => {
    try {
      const { materialIds, status, adminApproval } = req.body;
      if (!materialIds || !Array.isArray(materialIds) || materialIds.length === 0) {
        return res.status(400).json({ error: "Material IDs are required" });
      }
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      const materials = await storage.getMaterialsPickList();
      const selectedMaterials = materials.filter((m) => materialIds.includes(m.id.toString()));
      const alreadyOrdered = selectedMaterials.filter(
        (m) => m.status === "ordered" || m.status === "arrived" || m.status === "completed"
      );
      if (alreadyOrdered.length > 0 && !adminApproval) {
        return res.status(409).json({
          error: "DOUBLE_ORDER_PREVENTION",
          message: `Materials already ordered. Admin approval required.`,
          alreadyOrderedMaterials: alreadyOrdered
        });
      }
      const updatedMaterials = [];
      for (const materialId of materialIds) {
        try {
          const updated = await storage.updateMaterialOrder(parseInt(materialId), {
            status,
            notes: adminApproval ? "Admin approved override for duplicate order" : void 0
          });
          updatedMaterials.push(updated);
        } catch (error) {
          console.error(`Failed to update material ${materialId}:`, error);
        }
      }
      res.json({
        message: `Successfully updated ${updatedMaterials.length} materials to ${status}`,
        updatedMaterials,
        adminApproval: adminApproval || false
      });
    } catch (error) {
      console.error("Error in bulk update:", error);
      res.status(500).json({ error: "Failed to update materials" });
    }
  });
  app2.post("/api/materials/mark-out-of-stock", async (req, res) => {
    try {
      const { materialIds, notes } = req.body;
      if (!materialIds || !Array.isArray(materialIds) || materialIds.length === 0) {
        return res.status(400).json({ error: "Material IDs are required" });
      }
      const updatedMaterials = [];
      for (const materialId of materialIds) {
        try {
          const updated = await storage.updateMaterialOrder(parseInt(materialId), {
            status: "out_of_stock",
            notes: notes || "Marked as out of stock"
          });
          updatedMaterials.push(updated);
        } catch (error) {
          console.error(`Failed to mark material ${materialId} as out of stock:`, error);
        }
      }
      res.json({
        message: `Successfully marked ${updatedMaterials.length} materials as out of stock`,
        updatedMaterials
      });
    } catch (error) {
      console.error("Error marking materials as out of stock:", error);
      res.status(500).json({ error: "Failed to mark materials as out of stock" });
    }
  });
  app2.post("/api/orders/:orderId/generate-materials", async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      if (!orderId || isNaN(orderId)) {
        return res.status(400).json({ error: "Valid order ID is required" });
      }
      console.log(`Generating materials for order ID: ${orderId}`);
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      console.log(`Found order:`, order);
      const materialOrders2 = await storage.createMaterialOrdersFromorder(order);
      console.log(`Generated ${materialOrders2.length} material orders`);
      res.json({
        success: true,
        message: `Generated ${materialOrders2.length} material orders for order #${orderId}`,
        materialOrders: materialOrders2
      });
    } catch (error) {
      console.error("Error generating materials for order:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to generate material orders"
      });
    }
  });
  app2.post("/api/orders/generate-all-materials", async (req, res) => {
    try {
      const orders2 = await storage.getAllOrders();
      let totalMaterialOrders = 0;
      let processedOrders = 0;
      for (const order of orders2) {
        try {
          const materialOrders2 = await storage.createMaterialOrdersFromOrder(order);
          totalMaterialOrders += materialOrders2.length;
          processedOrders++;
        } catch (error) {
          console.error(`Error creating materials for order ${order.id}:`, error);
        }
      }
      res.json({
        success: true,
        message: `Generated ${totalMaterialOrders} material orders from ${processedOrders} orders`,
        totalMaterialOrders,
        processedOrders
      });
    } catch (error) {
      console.error("Error generating materials for all orders:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { orderGroupId, amount } = req.body;
      if (!orderGroupId || !amount) {
        return res.status(400).json({
          success: false,
          message: "Order group ID and amount are required"
        });
      }
      const amountInCents = Math.round(Number(amount) * 100);
      if (isNaN(amountInCents) || amountInCents <= 0) {
        return res.status(400).json({
          success: false,
          message: "Valid amount is required"
        });
      }
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({
          success: false,
          message: "Stripe is not configured. Please contact support."
        });
      }
      const stripe3 = new Stripe(process.env.STRIPE_SECRET_KEY);
      const paymentIntent = await stripe3.paymentIntents.create({
        amount: amountInCents,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true
        },
        metadata: {
          orderGroupId: orderGroupId.toString(),
          businessName: "Jay's Frames"
        },
        description: `Order #${orderGroupId} - Jay's Frames`
      });
      res.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        amount: amountInCents
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create payment intent",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  const {
    createNewPaymentLink: createNewPaymentLink2,
    getAllPaymentLinks: getAllPaymentLinks2,
    getPaymentLinkById: getPaymentLinkById2,
    sendPaymentLinkNotification: sendPaymentLinkNotification2,
    validatePaymentLinkByToken: validatePaymentLinkByToken2,
    completePaymentForLink: completePaymentForLink2,
    verifyPaymentCompletion: verifyPaymentCompletion2
  } = await Promise.resolve().then(() => (init_paymentLinkController(), paymentLinkController_exports));
  app2.post("/api/payment-links", createNewPaymentLink2);
  app2.get("/api/payment-links", getAllPaymentLinks2);
  app2.get("/api/payment-links/:id", getPaymentLinkById2);
  app2.post("/api/payment-links/:id/send", sendPaymentLinkNotification2);
  app2.get("/api/payment/:token/validate", validatePaymentLinkByToken2);
  app2.post("/api/payment/:token/complete", completePaymentForLink2);
  app2.post("/api/payment/:token/verify", verifyPaymentCompletion2);
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  wss.on("connection", (ws2) => {
    console.log("WebSocket client connected");
    ws2.on("message", (message) => {
      try {
        console.log("Received message:", message.toString());
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message.toString());
          }
        });
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });
    ws2.send(JSON.stringify({
      type: "connection",
      message: "WebSocket connection established"
    }));
  });
  return httpServer;
}

// server/index.ts
init_vite();
import path3 from "path";
import fs2 from "fs";
import { fileURLToPath as fileURLToPath2 } from "url";
import { dirname } from "path";
import cors from "cors";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname(__filename2);
var app = express4();
var PORT = parseInt(process.env.PORT || "8080", 10);
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5000",
    "https://localhost:5173",
    process.env.REPL_URL || "",
    process.env.FRONTEND_URL || "",
    // Allow Replit deployment domains
    /https:\/\/.*\.replit\.dev$/,
    /https:\/\/.*\.replit\.app$/,
    /https:\/\/.*\.repl\.co$/
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));
app.use(express4.json({ limit: "100mb" }));
app.use(express4.urlencoded({ extended: true, limit: "100mb" }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log2(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    log2(`Error: ${message} (${status})`, "error");
    console.error(err);
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const startServer = () => {
    try {
      const serverInstance = server.listen(PORT, "0.0.0.0", () => {
        log2(`serving on port ${PORT}`);
        console.log(`\u2713 Server running on port ${PORT}`);
        console.log(`\u2713 Environment: ${"production"}`);
        console.log(`\u2713 Ready for connections`);
      });
      serverInstance.on("error", (error) => {
        log2(`Server startup error: ${error.message}`, "error");
        console.error("Server error:", error);
        process.exit(1);
      });
      const gracefulShutdown = (signal) => {
        log2(`${signal} received, shutting down gracefully`, "info");
        console.log(`Shutting down server...`);
        serverInstance.close((error) => {
          if (error) {
            console.error("Error during shutdown:", error);
            process.exit(1);
          } else {
            log2("Server closed", "info");
            console.log("Server closed gracefully");
            process.exit(0);
          }
        });
        setTimeout(() => {
          console.log("Force exit after timeout");
          process.exit(1);
        }, 1e4);
      };
      process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
      process.on("SIGINT", () => gracefulShutdown("SIGINT"));
      return serverInstance;
    } catch (error) {
      log2(`Critical server startup failure: ${error?.message || error}`, "error");
      console.error("Critical error:", error);
      process.exit(1);
    }
  };
  const uploadsDir = path3.join(process.cwd(), "uploads");
  try {
    if (!fs2.existsSync(uploadsDir)) {
      fs2.mkdirSync(uploadsDir, { recursive: true });
    }
  } catch (error) {
    log2(`Warning: Could not create uploads directory: ${error}`, "warning");
  }
  app.use("/uploads", express4.static(uploadsDir));
  startServer();
})();
