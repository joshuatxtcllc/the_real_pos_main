var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
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

// client/src/data/studioMouldingCatalog.ts
var studioMouldingCatalog;
var init_studioMouldingCatalog = __esm({
  "client/src/data/studioMouldingCatalog.ts"() {
    "use strict";
    studioMouldingCatalog = [
      {
        id: "studio-SM1001",
        name: "Studio Classic Oak Profile",
        manufacturer: "Studio Moulding",
        material: "wood",
        width: "2.0",
        depth: "1.5",
        price: "15.99",
        catalogImage: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60",
        edgeTexture: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60",
        corner: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60",
        color: "#D2B48C",
        description: "Traditional oak frame with natural finish"
      },
      {
        id: "studio-SM1002",
        name: "Studio Modern Black Metal",
        manufacturer: "Studio Moulding",
        material: "metal",
        width: "1.5",
        depth: "0.75",
        price: "12.50",
        catalogImage: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60",
        edgeTexture: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60",
        corner: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60",
        color: "#000000",
        description: "Sleek black metal frame with matte finish"
      },
      {
        id: "studio-SM2001",
        name: "Studio Antique Gold Ornate",
        manufacturer: "Studio Moulding",
        material: "wood",
        width: "3.0",
        depth: "2.0",
        price: "28.75",
        catalogImage: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60",
        edgeTexture: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60",
        corner: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60",
        color: "#FFD700",
        description: "Ornate gold leaf frame for traditional artwork"
      },
      {
        id: "studio-SM2002",
        name: "Studio Silver Leaf Contemporary",
        manufacturer: "Studio Moulding",
        material: "wood",
        width: "2.5",
        depth: "1.25",
        price: "22.99",
        catalogImage: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60",
        edgeTexture: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60",
        corner: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60",
        color: "#C0C0C0",
        description: "Contemporary silver leaf frame"
      },
      {
        id: "studio-SM3001",
        name: "Studio Rustic Barnwood",
        manufacturer: "Studio Moulding",
        material: "wood",
        width: "2.75",
        depth: "1.75",
        price: "18.50",
        catalogImage: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60",
        edgeTexture: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60",
        corner: "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?w=800&auto=format&fit=crop&q=60",
        color: "#8B4513",
        description: "Distressed barnwood frame for rustic appeal"
      }
    ];
  }
});

// client/src/data/frameCatalog.ts
var frameCatalog;
var init_frameCatalog = __esm({
  "client/src/data/frameCatalog.ts"() {
    "use strict";
    init_studioMouldingCatalog();
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
      },
      // Include Studio Moulding frames
      ...studioMouldingCatalog
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
var db_exports = {};
__export(db_exports, {
  db: () => db,
  pool: () => pool,
  supabase: () => supabase
});
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
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 3e4,
      connectionTimeoutMillis: 2e3
    });
    pool.query("SELECT 1 as test").then(() => {
      console.log("\u2713 Database connection successful");
    }).catch((err) => {
      console.error("\u2717 Database connection failed:", err);
    });
    db = drizzle({ client: pool, schema: schema_exports });
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
import { eq, desc, sql, asc, and, or } from "drizzle-orm";
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
    DatabaseStorage = class {
      /**
       * Update the physical artwork location for an order
       * @param id Order ID
       * @param location Physical storage location
       * @returns Updated order
       */
      async updateOrderArtLocation(id, location) {
        try {
          const [updatedOrder] = await db.update(orders).set({ artworkLocation: location }).where(eq(orders.id, id)).returning();
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
          const result = await db.select().from(orderMats).where(eq(orderMats.orderId, orderId));
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
          console.error("Error getting order mats for order " + orderId + ":", error);
          return [];
        }
      }
      // Order frames methods
      async getOrderFrames(orderId) {
        try {
          const result = await db.select().from(orderFrames).where(eq(orderFrames.orderId, orderId));
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
          console.error("Error getting order frames for order " + orderId + ":", error);
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
        const [customer] = await db.select().from(customers).where(eq(customers.id, id));
        return customer || void 0;
      }
      async getCustomerByEmail(email) {
        const [customer] = await db.select().from(customers).where(eq(customers.email, email));
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
        const [updatedCustomer] = await db.update(customers).set(data).where(eq(customers.id, id)).returning();
        if (!updatedCustomer) {
          throw new Error("Customer not found");
        }
        return updatedCustomer;
      }
      // Frame methods
      async getFrame(id) {
        console.log("Storage: Getting frame with ID: " + id);
        try {
          const [frame] = await db.select().from(frames).where(eq(frames.id, id));
          if (frame) {
            console.log("Storage: Found frame in database: " + frame.name);
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
          console.log("Storage: Frame not found in database, checking catalog");
          const catalogFrame = frameCatalog.find((f) => f.id === id);
          if (catalogFrame) {
            console.log("Storage: Found frame in catalog: " + catalogFrame.name);
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
            console.log("Storage: Inserting enhanced frame into database: " + dbSafeFrame.name);
            try {
              await db.insert(frames).values(dbSafeFrame);
              console.log("Storage: Successfully inserted frame into database");
            } catch (error) {
              console.error("Storage: Error inserting frame into database:", error);
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
        const [updatedFrame] = await db.update(frames).set(data).where(eq(frames.id, id)).returning();
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
        const [matColor] = await db.select().from(matColors).where(eq(matColors.id, id));
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
        const [glassOption] = await db.select().from(glassOptions).where(eq(glassOptions.id, id));
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
        const [specialService] = await db.select().from(specialServices).where(eq(specialServices.id, id));
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
        const [orderGroup] = await db.select().from(orderGroups).where(eq(orderGroups.id, id));
        return orderGroup || void 0;
      }
      async getActiveOrderGroupByCustomer(customerId) {
        const [orderGroup] = await db.select().from(orderGroups).where(eq(orderGroups.customerId, customerId));
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
        const [updatedOrderGroup] = await db.update(orderGroups).set(data).where(eq(orderGroups.id, id)).returning();
        if (!updatedOrderGroup) {
          throw new Error("Order group not found");
        }
        return updatedOrderGroup;
      }
      async getOrderGroupsByCustomerId(customerId) {
        try {
          console.log(`Storage: Getting order groups for customer ID: ${customerId}`);
          const result = await db.select().from(orderGroups).where(eq(orderGroups.customerId, customerId));
          console.log(`Storage: Found ${result.length} order groups for customer ID: ${customerId}`);
          return result;
        } catch (error) {
          console.error("Storage: Error getting order groups by customer ID:", error);
          throw error;
        }
      }
      async getOrdersByGroupId(orderGroupId) {
        return await db.select().from(orders).where(eq(orders.orderGroupId, orderGroupId));
      }
      // Order methods
      async getOrder(id) {
        const [order] = await db.select().from(orders).where(eq(orders.id, id));
        return order || void 0;
      }
      async getAllOrders() {
        try {
          console.log("DatabaseStorage: Starting getAllOrders query...");
          const result = await db.select().from(orders).leftJoin(customers, eq(orders.customerId, customers.id)).orderBy(desc(orders.createdAt));
          console.log("DatabaseStorage: Raw orders from database:", result.length);
          if (result.length === 0) {
            console.log("DatabaseStorage: No orders found in database");
            return [];
          }
          const mappedOrders = result.map((row) => {
            console.log("DatabaseStorage: Processing order ID:", row.orders?.id);
            return {
              ...row.orders,
              customer: row.customers,
              // Ensure required fields have defaults
              status: row.orders.status || "pending",
              total: row.orders.total || "0.00",
              artworkWidth: row.orders.artworkWidth || 0,
              artworkHeight: row.orders.artworkHeight || 0
            };
          });
          console.log("DatabaseStorage: Returning", mappedOrders.length, "orders");
          return mappedOrders;
        } catch (error) {
          console.error("DatabaseStorage: Error fetching orders from database:", error);
          return [];
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
          const [updatedOrder] = await db.update(orders).set(updateData).where(eq(orders.id, id)).returning();
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
        await db.delete(orders).where(eq(orders.id, id));
      }
      // Order special service methods
      async createOrderSpecialService(orderSpecialService) {
        const [newOrderSpecialService] = await db.insert(orderSpecialServices).values(orderSpecialService).returning();
        return newOrderSpecialService;
      }
      async getOrderSpecialServices(orderId) {
        const orderSpecialServicesData = await db.select().from(orderSpecialServices).where(eq(orderSpecialServices.orderId, orderId));
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
        const [wholesaleOrder] = await db.select().from(wholesaleOrders).where(eq(wholesaleOrders.id, id));
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
        const [updatedWholesaleOrder] = await db.update(wholesaleOrders).set(data).where(eq(wholesaleOrders.id, id)).returning();
        if (!updatedWholesaleOrder) {
          throw new Error("Wholesale order not found");
        }
        return updatedWholesaleOrder;
      }
      // Production Kanban methods
      async getOrdersByProductionStatus(status) {
        return await db.select().from(orders).where(eq(orders.productionStatus, status)).orderBy(orders.lastStatusChange);
      }
      async updateOrderProductionStatus(id, status) {
        const [order] = await db.select().from(orders).where(eq(orders.id, id));
        if (!order) {
          throw new Error("Order not found");
        }
        const previousStatus = order.productionStatus;
        const [updatedOrder] = await db.update(orders).set({
          productionStatus: status,
          lastStatusChange: /* @__PURE__ */ new Date()
        }).where(eq(orders.id, id)).returning();
        if (updatedOrder.notificationsEnabled) {
          const [customer] = await db.select().from(customers).where(eq(customers.id, order.customerId));
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
                subject: "Order #" + order.id + " Status Update: " + status,
                message: "Your order is now " + status.split("_").join(" ") + ". Check your email for details.",
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
                subject: "Order #" + order.id + " Status Update: " + status,
                message: "Your order is now " + status.split("_").join(" ") + ".",
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
        }).from(orders).leftJoin(customers, eq(orders.customerId, customers.id)).orderBy(orders.lastStatusChange);
        return dbOrders.map((row) => ({
          ...row.order,
          customerName: row.customer ? row.customer.name : "Unknown Customer",
          customerPhone: row.customer?.phone || "No phone",
          customerEmail: row.customer?.email || "No email"
        }));
      }
      async scheduleOrderForProduction(id, estimatedDays) {
        const [order] = await db.select().from(orders).where(eq(orders.id, id));
        if (!order) {
          throw new Error("Order not found");
        }
        const [updatedOrder] = await db.update(orders).set({
          estimatedCompletionDays: estimatedDays,
          productionStatus: "scheduled"
        }).where(eq(orders.id, id)).returning();
        if (updatedOrder.notificationsEnabled) {
          const [customer] = await db.select().from(customers).where(eq(customers.id, order.customerId));
          if (customer) {
            const estimatedCompletionDate = /* @__PURE__ */ new Date();
            estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + estimatedDays);
            await this.createCustomerNotification({
              customerId: customer.id,
              orderId: order.id,
              notificationType: "estimated_completion",
              channel: "email",
              subject: "Your Custom Framing Order #" + order.id + " Has Been Scheduled",
              message: "Your custom framing order #" + order.id + " has been scheduled for production. The estimated completion date is " + estimatedCompletionDate.toLocaleDateString() + ".",
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
        return await db.select().from(customerNotifications).where(eq(customerNotifications.customerId, customerId)).orderBy(customerNotifications.sentAt, "desc");
      }
      async getNotificationsByOrder(orderId) {
        return await db.select().from(customerNotifications).where(eq(customerNotifications.orderId, orderId)).orderBy(customerNotifications.sentAt, "desc");
      }
      // Material order methods
      async getMaterialOrder(id) {
        const [materialOrder] = await db.select().from(materialOrders).where(eq(materialOrders.id, id));
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
          return await db.select().from(materialOrders).where(eq(materialOrders.status, status)).orderBy(desc(materialOrders.createdAt));
        } catch (error) {
          console.error("Error in getMaterialOrdersByStatus:", error);
          return [];
        }
      }
      async getMaterialOrdersByType(materialType) {
        try {
          return await db.select().from(materialOrders).where(eq(materialOrders.materialType, materialType)).orderBy(desc(materialOrders.createdAt));
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
          const [updatedMaterialOrder] = await db.update(materialOrders).set(cleanData).where(eq(materialOrders.id, materialId)).returning();
          console.log("Successfully updated material order:", updatedMaterialOrder.id);
          return updatedMaterialOrder;
        } catch (error) {
          console.error("Error updating material order:", error);
          throw error;
        }
      }
      async deleteMaterialOrder(id) {
        await db.delete(materialOrders).where(eq(materialOrders.id, id));
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
          const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id));
          return item;
        } catch (error) {
          console.error("Error in getInventoryItem:", error);
          return void 0;
        }
      }
      async getInventoryItemByBarcode(barcode) {
        try {
          const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.barcode, barcode));
          return item;
        } catch (error) {
          console.error("Error in getInventoryItemByBarcode:", error);
          return void 0;
        }
      }
      async createInventoryItem(inventoryItem) {
        try {
          if (!inventoryItem.sku) {
            inventoryItem.sku = "INV-" + Date.now().toString(36).toUpperCase();
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
          }).where(eq(inventoryItems.id, id)).returning();
          return updatedItem;
        } catch (error) {
          console.error("Error in updateInventoryItem:", error);
          throw error;
        }
      }
      async deleteInventoryItem(id) {
        try {
          await db.delete(inventoryTransactions).where(eq(inventoryTransactions.itemId, id));
          await db.delete(inventoryItems).where(eq(inventoryItems.id, id));
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
          const transactions = await db.select().from(inventoryTransactions).where(eq(inventoryTransactions.itemId, itemId));
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
            }).where(eq(inventoryItems.id, transaction.itemId));
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
          const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
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
          const [updatedSupplier] = await db.update(suppliers).set(supplier).where(eq(suppliers.id, id)).returning();
          return updatedSupplier;
        } catch (error) {
          console.error("Error in updateSupplier:", error);
          throw error;
        }
      }
      async deleteSupplier(id) {
        try {
          await db.delete(suppliers).where(eq(suppliers.id, id));
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
          const [location] = await db.select().from(inventoryLocations).where(eq(inventoryLocations.id, id));
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
          const [order] = await db.select().from(purchaseOrders).where(eq(purchaseOrders.id, id));
          return order;
        } catch (error) {
          console.error("Error in getPurchaseOrder:", error);
          return void 0;
        }
      }
      async createPurchaseOrderWithLines(orderData, lines) {
        try {
          const poNumber = "PO-" + Date.now().toString(36).toUpperCase();
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
          const [category] = await db.select().from(inventoryCategories).where(eq(inventoryCategories.id, id));
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
        const [notification] = await db.select().from(notifications).where(eq(notifications.id, id));
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
        return await db.select().from(notifications).where(eq(notifications.read, false)).orderBy(desc(notifications.createdAt));
      }
      async markNotificationAsRead(id) {
        const [updatedNotification] = await db.update(notifications).set({ read: true }).where(eq(notifications.id, id)).returning();
        return updatedNotification;
      }
      async getNotificationsByUser(userId) {
        return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
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
              eq(materialOrders.status, "pending"),
              eq(materialOrders.status, "processed"),
              eq(materialOrders.status, "ordered"),
              eq(materialOrders.status, "arrived")
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
          console.error("Error in getMaterialsPickList:", error);
          throw error;
        }
      }
      async getMaterialsForOrder(orderId) {
        try {
          const materials = await db.select().from(materialOrders).where(eq(materialOrders.sourceOrderId, orderId));
          return materials;
        } catch (error) {
          console.error("Error in getMaterialsForOrder:", error);
          throw error;
        }
      }
      async createPurchaseOrder(materialIds) {
        try {
          const numericIds = materialIds.map((id) => parseInt(id));
          const selectedMaterials = await db.select().from(materialOrders).where(or(...numericIds.map((id) => eq(materialOrders.id, id))));
          if (selectedMaterials.length === 0) {
            throw new Error("No valid materials found for purchase order");
          }
          const alreadyOrdered = selectedMaterials.filter(
            (m) => m.status === "ordered" || m.status === "arrived" || m.status === "completed"
          );
          if (alreadyOrdered.length > 0) {
            throw new Error("Materials already ordered: " + alreadyOrdered.map((m) => m.materialName).join(", "));
          }
          await db.update(materialOrders).set({
            status: "ordered",
            orderDate: /* @__PURE__ */ new Date()
          }).where(or(...numericIds.map((id) => eq(materialOrders.id, id))));
          const totalAmount = selectedMaterials.reduce((sum, material) => {
            return sum + (Number(material.totalCost) || 0);
          }, 0);
          const purchaseOrder = {
            id: "po-" + Date.now(),
            orderNumber: "PO-" + (/* @__PURE__ */ new Date()).getFullYear() + "-" + String(Math.floor(Math.random() * 1e3)).padStart(3, "0"),
            materialIds,
            totalAmount,
            status: "sent",
            createdAt: (/* @__PURE__ */ new Date()).toISOString(),
            expectedDeliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1e3).toISOString(),
            materials: selectedMaterials
          };
          return purchaseOrder;
        } catch (error) {
          console.error("Error in createPurchaseOrder:", error);
          throw error;
        }
      }
      // Failsafe mechanism to check for duplicate material orders
      async checkDuplicateMaterialOrder(materialId, sourceOrderId) {
        try {
          const existing = await db.select().from(materialOrders).where(
            and(
              eq(materialOrders.materialId, materialId),
              eq(materialOrders.sourceOrderId, sourceOrderId),
              or(
                eq(materialOrders.status, "pending"),
                eq(materialOrders.status, "ordered"),
                eq(materialOrders.status, "arrived")
              )
            )
          );
          return existing.length > 0;
        } catch (error) {
          console.error("Error checking duplicate material order:", error);
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
                  notes: "Frame for order #" + order.id
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
                  notes: "Mat board for order #" + order.id + " - " + matWidth + '"x' + matHeight + '"'
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
                  notes: "Glass for order #" + order.id + " - " + glassWidth + '"x' + glassHeight + '"'
                });
              }
            }
          }
          console.log("Attempting to save " + materialOrders2.length + " material orders");
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
          console.log("Successfully created " + createdOrders.length + " material orders for order " + order.id);
          return createdOrders;
        } catch (error) {
          console.error("Error creating material orders from order:", error);
          throw error;
        }
      }
    };
    storage = new DatabaseStorage();
  }
});

// server/index.ts
import express2 from "express";
import cors from "cors";
import path3 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import dotenv from "dotenv";

// server/routes/ordersRoutes.ts
import { Router } from "express";

// server/controllers/ordersController.ts
init_storage();
import axios2 from "axios";

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
async function callOrderComplete(customerName, phoneNumber, orderNumber) {
  const message = `Hello ${customerName}, this is Jay's Frames with great news! Your custom framing order number ${orderNumber} is now complete and ready for pickup. We're excited for you to see the beautiful result. Please come by during our business hours to collect your order. Thank you for choosing Jay's Frames.`;
  return await makeVoiceCall({
    to: phoneNumber,
    message,
    voice: "alice"
  });
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

// server/controllers/ordersController.ts
init_db();
init_schema();
import { eq as eq2 } from "drizzle-orm";
var orderNotificationService = new SimpleOrderNotificationService();
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
async function getAllOrders(req, res) {
  try {
    console.log("OrdersController: Fetching all orders from database...");
    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
    console.log("NODE_ENV:", "production");
    const { pool: pool2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const connectionTest = await pool2.query("SELECT 1 as test");
    console.log("Database connection test:", connectionTest.rows);
    const ordersResult = await pool2.query(`
      SELECT 
        o.*,
        c.name as customer_name,
        c.email as customer_email,
        c.phone as customer_phone
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
    `);
    console.log("OrdersController: Raw SQL query found", ordersResult.rows.length, "orders");
    const orders2 = ordersResult.rows.map((row) => ({
      ...row,
      customer: row.customer_name ? {
        id: row.customer_id,
        name: row.customer_name,
        email: row.customer_email,
        phone: row.customer_phone
      } : null,
      // Ensure numeric fields are properly typed
      id: parseInt(row.id),
      customerId: parseInt(row.customer_id),
      artworkWidth: parseFloat(row.artwork_width) || 0,
      artworkHeight: parseFloat(row.artwork_height) || 0,
      total: row.total || "0.00"
    }));
    console.log("OrdersController: Returning", orders2.length, "orders to frontend");
    res.json({
      success: true,
      orders: orders2,
      source: "raw_sql",
      count: orders2.length
    });
  } catch (error) {
    console.error("OrdersController: Error fetching orders:", error);
    console.error("Error stack:", error.stack);
    res.status(200).json({
      success: false,
      error: error.message || "Failed to fetch orders",
      orders: [],
      count: 0
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
    orderData.status = orderData.status || "pending";
    console.log("Processing order creation...");
    const order = await storage.createOrder(orderData);
    console.log("Order created successfully:", order);
    await syncOrderToKanban(order);
    try {
      if (order.customerId) {
        const customer = await storage.getCustomer(order.customerId);
        if (customer && customer.phone) {
          await orderNotificationService.handleOrderEvent({
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
      message: "Order saved successfully without payment requirement",
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
async function updateOrderStatus(req, res) {
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
            await orderNotificationService.handleOrderEvent({
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
var router = Router();
router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderById);
router.post("/orders", createOrder);
router.patch("/orders/:id", updateOrder);
router.patch("/orders/:id/status", updateOrderStatus);
router.delete("/orders/:id", deleteOrder);
router.post("/orders/:id/send-update", async (req, res) => {
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
router.post("/orders/:orderId/test-kanban-sync", testKanbanSync);
router.get("/kanban/status", getKanbanStatus);
router.get("/order-groups", getAllOrderGroups);
router.post("/order-groups", createOrderGroup);
var ordersRoutes_default = router;

// server/routes/customersRoutes.ts
import { Router as Router2 } from "express";

// server/controllers/customersController.ts
init_db();
init_schema();
import { eq as eq3, desc as desc2 } from "drizzle-orm";
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
    const customer = await db.select().from(customers).where(eq3(customers.id, customerId)).limit(1);
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
var router2 = Router2();
router2.get("/customers", getAllCustomers);
router2.get("/customers/:id", getCustomerById);
router2.post("/customers", createCustomer);
var customersRoutes_default = router2;

// server/routes/inventoryRoutes.ts
import { Router as Router3 } from "express";

// server/controllers/inventoryController.ts
init_db();
init_schema();
import { eq as eq4 } from "drizzle-orm";
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
    const location = await db.select().from(inventoryLocations).where(eq4(inventoryLocations.id, parseInt(id))).limit(1);
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
    const [updatedLocation] = await db.update(inventoryLocations).set(validatedData).where(eq4(inventoryLocations.id, parseInt(id))).returning();
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
    const itemsInLocation = await db.select({ count: db.fn.count() }).from(inventoryItems).where(eq4(inventoryItems.locationId, parseInt(id)));
    if (parseInt(itemsInLocation[0].count) > 0) {
      return res.status(400).json({
        message: "Cannot delete location with assigned items. Move items to another location first."
      });
    }
    const result = await db.delete(inventoryLocations).where(eq4(inventoryLocations.id, parseInt(id))).returning({ id: inventoryLocations.id });
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
    }).from(inventoryItems).leftJoin(inventoryLocations, eq4(inventoryItems.locationId, inventoryLocations.id));
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
var router3 = Router3();
router3.get("/inventory/locations", getAllInventoryLocations);
router3.get("/inventory/locations/:id", getInventoryLocationById);
router3.post("/inventory/locations", createInventoryLocation);
router3.put("/inventory/locations/:id", updateInventoryLocation);
router3.delete("/inventory/locations/:id", deleteInventoryLocation);
router3.get("/inventory/items", getAllInventoryItems);
router3.get("/inventory/items/low-stock", getLowStockItems);
router3.get("/inventory/suppliers", getAllSuppliers);
var inventoryRoutes_default = router3;

// server/routes/materialsRoutes.ts
import { Router as Router4 } from "express";

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

// server/routes/materialsRoutes.ts
var router4 = Router4();
router4.get("/pick-list", getMaterialsPickList);
router4.get("/by-supplier", getMaterialsBySupplier);
router4.get("/by-order/:orderId", getMaterialsForOrder);
router4.patch("/:id", updateMaterial);
router4.post("/purchase-orders", createPurchaseOrder);
router4.get("/types", getMaterialTypes);
router4.get("/suppliers", getMaterialSuppliers);
var materialsRoutes_default = router4;

// server/routes/invoiceRoutes.ts
import { Router as Router5 } from "express";

// server/controllers/invoiceController.ts
init_storage();
init_emailService();
async function getInvoiceById(req, res) {
  try {
    const { orderGroupId } = req.params;
    if (!orderGroupId || isNaN(parseInt(orderGroupId))) {
      return res.status(400).json({ message: "Invalid order group ID" });
    }
    const groupId = parseInt(orderGroupId);
    const orderGroup = await storage.getOrderGroup(groupId);
    if (!orderGroup) {
      return res.status(404).json({ message: "Order group not found" });
    }
    const orders2 = await storage.getOrdersByGroupId(groupId);
    if (!orders2 || orders2.length === 0) {
      return res.status(404).json({ message: "No orders found in this group" });
    }
    const customer = await storage.getCustomer(orderGroup.customerId || 0);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    return res.status(200).json({
      orderGroup,
      orders: orders2,
      customer
    });
  } catch (error) {
    console.error("Error generating invoice:", error);
    return res.status(500).json({ message: "Failed to generate invoice" });
  }
}
async function getCustomerInvoices(req, res) {
  try {
    const { customerId } = req.params;
    if (!customerId || isNaN(parseInt(customerId))) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }
    const id = parseInt(customerId);
    const customer = await storage.getCustomer(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const orderGroups2 = await storage.getCustomerOrderGroups(id);
    if (!orderGroups2 || orderGroups2.length === 0) {
      return res.json([]);
    }
    const invoices = await Promise.all(orderGroups2.map(async (orderGroup) => {
      const orders2 = await storage.getOrdersByGroupId(orderGroup.id);
      return {
        orderGroup,
        orders: orders2,
        customer
      };
    }));
    return res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching customer invoices:", error);
    return res.status(500).json({ message: "Failed to fetch customer invoices" });
  }
}
async function sendInvoiceByEmail(req, res) {
  try {
    const { orderGroupId } = req.params;
    const { email } = req.body;
    if (!orderGroupId || isNaN(parseInt(orderGroupId))) {
      return res.status(400).json({ message: "Invalid order group ID" });
    }
    const groupId = parseInt(orderGroupId);
    const orderGroup = await storage.getOrderGroup(groupId);
    if (!orderGroup) {
      return res.status(404).json({ message: "Order group not found" });
    }
    const customer = await storage.getCustomer(orderGroup.customerId || 0);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const recipientEmail = email || customer.email;
    if (!recipientEmail) {
      return res.status(400).json({
        success: false,
        message: "No email address available for this customer"
      });
    }
    const orders2 = await storage.getOrdersByGroupId(groupId);
    const invoiceHTML = generateInvoiceHTML(orderGroup, orders2, customer);
    await sendEmailWithSendGrid({
      to: recipientEmail,
      from: "info@jaysframes.com",
      // This should be a verified sender
      subject: `Your Invoice #${orderGroup.id} from Jay's Frames`,
      text: `Thank you for your business! Your invoice #${orderGroup.id} is attached.`,
      html: invoiceHTML
    });
    await storage.updateOrderGroup(groupId, {
      invoiceEmailSent: true,
      invoiceEmailDate: /* @__PURE__ */ new Date()
    });
    return res.status(200).json({
      success: true,
      message: "Invoice sent successfully"
    });
  } catch (error) {
    console.error("Error sending invoice by email:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send invoice by email"
    });
  }
}
async function markInvoiceAsSent(req, res) {
  try {
    const { orderGroupId } = req.params;
    if (!orderGroupId || isNaN(parseInt(orderGroupId))) {
      return res.status(400).json({ message: "Invalid order group ID" });
    }
    const groupId = parseInt(orderGroupId);
    await storage.updateOrderGroup(groupId, {
      invoiceEmailSent: true,
      invoiceEmailDate: /* @__PURE__ */ new Date()
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error marking invoice as sent:", error);
    return res.status(500).json({ success: false });
  }
}
async function recordPartialPayment(req, res) {
  try {
    const { orderGroupId } = req.params;
    const { amount, paymentMethod, notes } = req.body;
    if (!orderGroupId || isNaN(parseInt(orderGroupId))) {
      return res.status(400).json({ message: "Invalid order group ID" });
    }
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }
    const groupId = parseInt(orderGroupId);
    const paymentAmount = parseFloat(amount);
    const orderGroup = await storage.getOrderGroup(groupId);
    if (!orderGroup) {
      return res.status(404).json({ message: "Order group not found" });
    }
    const totalAmount = parseFloat(orderGroup.total);
    const currentPaid = parseFloat(orderGroup.amountPaid || "0");
    const newTotalPaid = currentPaid + paymentAmount;
    const balanceDue = totalAmount - newTotalPaid;
    let paymentStatus = "partial";
    if (newTotalPaid >= totalAmount) {
      paymentStatus = "paid";
    } else if (newTotalPaid === 0) {
      paymentStatus = "pending";
    }
    await storage.updateOrderGroup(groupId, {
      amountPaid: newTotalPaid.toString(),
      balanceDue: Math.max(0, balanceDue).toString(),
      paymentStatus,
      paymentMethod: paymentMethod || orderGroup.paymentMethod,
      paymentDate: paymentStatus === "paid" ? /* @__PURE__ */ new Date() : orderGroup.paymentDate,
      notes: notes ? `${orderGroup.notes || ""}
Payment recorded: $${paymentAmount} via ${paymentMethod}` : orderGroup.notes
    });
    return res.status(200).json({
      success: true,
      amountPaid: newTotalPaid,
      balanceDue: Math.max(0, balanceDue),
      paymentStatus
    });
  } catch (error) {
    console.error("Error recording partial payment:", error);
    return res.status(500).json({ success: false, message: "Failed to record payment" });
  }
}
async function setPaymentTerms(req, res) {
  try {
    const { orderGroupId } = req.params;
    const { paymentTerms, depositAmount, deferPayment } = req.body;
    if (!orderGroupId || isNaN(parseInt(orderGroupId))) {
      return res.status(400).json({ message: "Invalid order group ID" });
    }
    const groupId = parseInt(orderGroupId);
    const orderGroup = await storage.getOrderGroup(groupId);
    if (!orderGroup) {
      return res.status(404).json({ message: "Order group not found" });
    }
    const updateData = {};
    if (deferPayment) {
      updateData.paymentStatus = "deferred";
      updateData.finalPaymentDue = true;
      updateData.balanceDue = orderGroup.total;
    } else if (depositAmount) {
      const deposit = parseFloat(depositAmount);
      const total = parseFloat(orderGroup.total);
      updateData.depositAmount = deposit.toString();
      updateData.amountPaid = "0";
      updateData.balanceDue = (total - deposit).toString();
      updateData.paymentStatus = "partial";
    }
    if (paymentTerms) {
      updateData.notes = `${orderGroup.notes || ""}
Payment Terms: ${paymentTerms}`;
    }
    await storage.updateOrderGroup(groupId, updateData);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error setting payment terms:", error);
    return res.status(500).json({ success: false, message: "Failed to set payment terms" });
  }
}
function generateInvoiceHTML(orderGroup, orders2, customer) {
  const formatCurrency = (amount) => {
    if (!amount) return "$0.00";
    return `$${Number(amount).toFixed(2)}`;
  };
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };
  const orderRows = orders2.map((order) => `
    <tr>
      <td>Custom Framing #${order.id}</td>
      <td>${order.artworkDescription || "Custom Frame"}<br>${order.artworkType ? `Type: ${order.artworkType}` : ""}</td>
      <td>${order.artworkWidth}" \xD7 ${order.artworkHeight}"<br>Mat: ${order.matWidth}"</td>
      <td>${order.quantity}</td>
      <td style="text-align: right;">${formatCurrency(order.subtotal)}</td>
      <td style="text-align: right;">${formatCurrency(order.total)}</td>
    </tr>
  `).join("");
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice #${orderGroup.id}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .invoice-title {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }
        .invoice-details {
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #f0f0f0;
        }
        .text-right {
          text-align: right;
        }
        .customer-details, .invoice-info {
          margin-bottom: 20px;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <div>
          <div class="invoice-title">Jays Frames Guru Framing</div>
          <div>123 Frame Street</div>
          <div>Anytown, ST 12345</div>
          <div>Phone: (555) 123-4567</div>
          <div>Email: info@jaysframes.com</div>
        </div>
        <div style="text-align: right;">
          <div class="invoice-title">INVOICE</div>
          <div><strong>Invoice #:</strong> ${orderGroup.id}</div>
          <div><strong>Date:</strong> ${formatDate(orderGroup.createdAt)}</div>
          <div><strong>Due Date:</strong> ${formatDate(orderGroup.paymentDate || orderGroup.createdAt)}</div>
          <div><strong>Status:</strong> ${orderGroup.stripePaymentStatus || orderGroup.status}</div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div class="customer-details">
          <div style="font-weight: bold; margin-bottom: 5px;">Bill To:</div>
          <div>${customer.name}</div>
          <div>${customer.address || "No address on file"}</div>
          <div>Phone: ${customer.phone || "N/A"}</div>
          <div>Email: ${customer.email || "N/A"}</div>
        </div>
        <div class="invoice-info">
          <div><strong>Payment Method:</strong> ${orderGroup.paymentMethod || "N/A"}</div>
          ${orderGroup.paymentMethod === "check" ? `<div><strong>Check #:</strong> ${orderGroup.checkNumber || "N/A"}</div>` : ""}
          ${orderGroup.discountAmount ? `
            <div>
              <strong>Discount:</strong> ${orderGroup.discountType === "percentage" ? `${orderGroup.discountAmount}%` : formatCurrency(orderGroup.discountAmount)}
            </div>
          ` : ""}
          <div><strong>Tax Exempt:</strong> ${orderGroup.taxExempt ? "Yes" : "No"}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th>Size</th>
            <th>Quantity</th>
            <th style="text-align: right;">Price</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${orderRows}
        </tbody>
      </table>

      <div style="display: flex; justify-content: flex-end;">
        <table style="width: 250px;">
          <tbody>
            <tr>
              <td><strong>Subtotal:</strong></td>
              <td class="text-right">${formatCurrency(orderGroup.subtotal)}</td>
            </tr>
            ${orderGroup.discountAmount ? `
            <tr>
              <td><strong>Discount:</strong></td>
              <td class="text-right">-${formatCurrency(orderGroup.discountAmount)}</td>
            </tr>
            ` : ""}
            <tr>
              <td><strong>Tax:</strong></td>
              <td class="text-right">${formatCurrency(orderGroup.tax)}</td>
            </tr>
            <tr style="border-top: 1px solid #ddd;">
              <td style="padding-top: 5px;"><strong>Total:</strong></td>
              <td class="text-right" style="padding-top: 5px; font-weight: bold;">${formatCurrency(orderGroup.total)}</td>
            </tr>
            ${orderGroup.amountPaid && parseFloat(orderGroup.amountPaid) > 0 ? `
            <tr>
              <td><strong>Amount Paid:</strong></td>
              <td class="text-right" style="color: green;">${formatCurrency(orderGroup.amountPaid)}</td>
            </tr>
            ` : ""}
            ${orderGroup.balanceDue && parseFloat(orderGroup.balanceDue) > 0 ? `
            <tr style="border-top: 1px solid #ddd;">
              <td style="padding-top: 5px;"><strong>Balance Due:</strong></td>
              <td class="text-right" style="padding-top: 5px; font-weight: bold; color: red;">${formatCurrency(orderGroup.balanceDue)}</td>
            </tr>
            ` : ""}
            ${orderGroup.depositAmount ? `
            <tr>
              <td><strong>Deposit Required:</strong></td>
              <td class="text-right">${formatCurrency(orderGroup.depositAmount)}</td>
            </tr>
            ` : ""}
            ${orderGroup.paymentStatus === "deferred" ? `
            <tr>
              <td colspan="2" style="text-align: center; font-weight: bold; color: orange; padding: 10px;">
                Payment Due Upon Completion
              </td>
            </tr>
            ` : ""}
            ${orderGroup.paymentMethod === "cash" && orderGroup.cashAmount ? `
            <tr>
              <td><strong>Cash Received:</strong></td>
              <td class="text-right">${formatCurrency(orderGroup.cashAmount)}</td>
            </tr>
            <tr>
              <td><strong>Change:</strong></td>
              <td class="text-right">${formatCurrency(Number(orderGroup.cashAmount) - Number(orderGroup.total))}</td>
            </tr>
            ` : ""}
          </tbody>
        </table>
      </div>

      <div style="margin-top: 30px; font-size: 14px;">
        <div style="font-weight: bold; margin-bottom: 5px;">Terms & Conditions:</div>
        <ul style="padding-left: 20px;">
          <li>Payment is due upon receipt unless other arrangements have been made.</li>
          <li>Custom framing orders cannot be returned or exchanged.</li>
          <li>Please retain this invoice for your records and for pickup of your completed orders.</li>
        </ul>
      </div>

      <div class="footer">
        Thank you for your business!
      </div>
    </body>
    </html>
  `;
}

// server/routes/invoiceRoutes.ts
var router5 = Router5();
router5.get("/invoices/:orderGroupId", getInvoiceById);
router5.get("/customers/:customerId/invoices", getCustomerInvoices);
router5.post("/invoices/:orderGroupId/send", sendInvoiceByEmail);
router5.patch("/invoices/:orderGroupId/mark-sent", markInvoiceAsSent);
router5.post("/invoices/:orderGroupId/record-payment", recordPartialPayment);
router5.patch("/invoices/:orderGroupId/payment-terms", setPaymentTerms);
var invoiceRoutes_default = router5;

// server/routes/fileRoutes.ts
import { Router as Router6 } from "express";

// server/services/fileStorageService.ts
init_storage();
import fs from "fs/promises";
import path from "path";
import { existsSync } from "fs";
var UPLOAD_DIR = path.join(process.cwd(), "uploads");
var ORDER_IMAGES_DIR = path.join(UPLOAD_DIR, "order-images");
async function ensureDirectoriesExist() {
  try {
    if (!existsSync(UPLOAD_DIR)) {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }
    if (!existsSync(ORDER_IMAGES_DIR)) {
      await fs.mkdir(ORDER_IMAGES_DIR, { recursive: true });
    }
  } catch (error) {
    console.error("Error creating upload directories:", error);
    throw error;
  }
}
ensureDirectoriesExist();
async function saveOrderArtworkImage(orderId, imageData, fileName = "artwork.jpg") {
  try {
    const orderDir = path.join(ORDER_IMAGES_DIR, orderId.toString());
    if (!existsSync(orderDir)) {
      await fs.mkdir(orderDir, { recursive: true });
    }
    const filePath = path.join(orderDir, fileName);
    let imageBuffer;
    if (typeof imageData === "string" && imageData.startsWith("data:")) {
      const base64Data = imageData.split(",")[1];
      imageBuffer = Buffer.from(base64Data, "base64");
    } else if (typeof imageData === "string") {
      imageBuffer = Buffer.from(imageData, "base64");
    } else {
      imageBuffer = imageData;
    }
    await fs.writeFile(filePath, imageBuffer);
    await storage.updateOrder(orderId, {
      artworkImagePath: path.relative(UPLOAD_DIR, filePath)
    });
    return filePath;
  } catch (error) {
    console.error(`Error saving artwork image for order ${orderId}:`, error);
    throw error;
  }
}
async function getOrderArtworkImage(orderId, fileName = "artwork.jpg") {
  try {
    const filePath = path.join(ORDER_IMAGES_DIR, orderId.toString(), fileName);
    if (!existsSync(filePath)) {
      return null;
    }
    return await fs.readFile(filePath);
  } catch (error) {
    console.error(`Error retrieving artwork image for order ${orderId}:`, error);
    return null;
  }
}
async function saveOrderFile(orderId, fileData, fileName) {
  try {
    const orderDir = path.join(ORDER_IMAGES_DIR, orderId.toString());
    if (!existsSync(orderDir)) {
      await fs.mkdir(orderDir, { recursive: true });
    }
    const filePath = path.join(orderDir, fileName);
    await fs.writeFile(filePath, fileData);
    return filePath;
  } catch (error) {
    console.error(`Error saving file for order ${orderId}:`, error);
    throw error;
  }
}
async function saveOrderFramePreview(orderId, previewData) {
  try {
    return await saveOrderArtworkImage(orderId, previewData, "frame-preview.jpg");
  } catch (error) {
    console.error(`Error saving frame preview for order ${orderId}:`, error);
    throw error;
  }
}

// server/controllers/fileController.ts
init_storage();
import path2 from "path";
import fs2 from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createRequire } from "module";
import multer from "multer";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var require2 = createRequire(import.meta.url);
async function uploadArtworkImage(req, res) {
  try {
    const { orderId } = req.params;
    const { imageData } = req.body;
    if (!imageData) {
      return res.status(400).json({ message: "No image data provided" });
    }
    const order = await storage.getOrder(parseInt(orderId));
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const filePath = await saveOrderArtworkImage(parseInt(orderId), imageData);
    return res.status(200).json({
      message: "Artwork image saved successfully",
      filePath: path2.basename(filePath)
    });
  } catch (error) {
    console.error("Error uploading artwork image:", error);
    return res.status(500).json({ message: "Error saving artwork image" });
  }
}
async function getArtworkImage(req, res) {
  try {
    const { orderId } = req.params;
    const order = await storage.getOrder(parseInt(orderId));
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const imageData = await getOrderArtworkImage(parseInt(orderId));
    if (!imageData) {
      return res.status(404).json({ message: "Artwork image not found" });
    }
    res.contentType("image/jpeg");
    return res.send(imageData);
  } catch (error) {
    console.error("Error retrieving artwork image:", error);
    return res.status(500).json({ message: "Error retrieving artwork image" });
  }
}
async function getOrderFilesList(req, res) {
  try {
    const { orderId } = req.params;
    const order = await storage.getOrder(parseInt(orderId));
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const uploadsDir = path2.join(process.cwd(), "uploads");
    const orderDir = path2.join(uploadsDir, `order-${orderId}`);
    let fileInfos = [];
    if (fs2.existsSync(orderDir)) {
      const files = fs2.readdirSync(orderDir);
      fileInfos = files.map((file) => {
        const filePath = path2.join(orderDir, file);
        const stats = fs2.statSync(filePath);
        return {
          name: file,
          path: filePath,
          type: determineFileType(file),
          size: stats.size,
          lastModified: stats.mtime
        };
      });
    }
    return res.status(200).json(fileInfos);
  } catch (error) {
    console.error("Error retrieving order files:", error);
    return res.status(500).json({ message: "Error retrieving order files" });
  }
}
function determineFileType(filePath) {
  const ext = path2.extname(filePath).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".pdf":
      return "application/pdf";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}
async function uploadOrderFile(req, res) {
  try {
    const { orderId } = req.params;
    const { fileData, fileName, fileType } = req.body;
    if (!fileData || !fileName) {
      return res.status(400).json({ message: "File data and name are required" });
    }
    const order = await storage.getOrder(parseInt(orderId));
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    let data;
    if (fileData.startsWith("data:")) {
      const base64Data = fileData.split(",")[1];
      data = Buffer.from(base64Data, "base64");
    } else {
      data = Buffer.from(fileData, "base64");
    }
    const filePath = await saveOrderFile(parseInt(orderId), data, fileName);
    return res.status(200).json({
      message: "File saved successfully",
      filePath: path2.basename(filePath)
    });
  } catch (error) {
    console.error("Error uploading order file:", error);
    return res.status(500).json({ message: "Error saving order file" });
  }
}
async function saveFramePreview(req, res) {
  try {
    const { orderId } = req.params;
    const { previewData } = req.body;
    if (!previewData) {
      return res.status(400).json({ message: "No preview data provided" });
    }
    const order = await storage.getOrder(parseInt(orderId));
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const filePath = await saveOrderFramePreview(parseInt(orderId), previewData);
    return res.status(200).json({
      message: "Frame preview saved successfully",
      filePath: path2.basename(filePath)
    });
  } catch (error) {
    console.error("Error saving frame preview:", error);
    return res.status(500).json({ message: "Error saving frame preview" });
  }
}
var fileStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    const orderId = req.params.orderId || req.body.orderId;
    const uploadDir = path2.join(__dirname, "../../uploads", orderId);
    if (!fs2.existsSync(uploadDir)) {
      fs2.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const fileExt = path2.extname(file.originalname);
    const fileName = `${Date.now()}-${file.fieldname}${fileExt}`;
    cb(null, fileName);
  }
});
var fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, PNG, WEBP, and PDF files are allowed."));
  }
};
var upload = multer({
  storage: fileStorage,
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB max file size
  },
  fileFilter
});
var uploadOrderArtwork = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const filePath = req.file.path.replace(/\\/g, "/").replace("uploads/", "");
    console.log(`Artwork uploaded for order ${orderId}: ${filePath}`);
    res.status(200).json({
      message: "Artwork uploaded successfully",
      file: {
        path: filePath,
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error("Error uploading artwork:", error);
    res.status(500).json({ message: "Failed to upload artwork" });
  }
};
var getOrderFiles = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const uploadsDir = path2.join(process.cwd(), "uploads", `order-${orderId}`);
    let files = [];
    if (fs2.existsSync(uploadsDir)) {
      const fileNames = fs2.readdirSync(uploadsDir);
      files = fileNames.map((fileName) => ({
        name: fileName,
        path: path2.join(uploadsDir, fileName),
        type: fileName.split(".").pop() || "unknown"
      }));
    }
    res.status(200).json(files);
  } catch (error) {
    console.error("Error retrieving order files:", error);
    res.status(500).json({ message: "Failed to retrieve order files" });
  }
};
var deleteOrderFile = async (req, res) => {
  const { orderId, fileId } = req.params;
  try {
    const uploadsDir = path2.join(process.cwd(), "uploads", `order-${orderId}`);
    const filePath = path2.join(uploadsDir, fileId);
    if (fs2.existsSync(filePath)) {
      fs2.unlinkSync(filePath);
      res.status(200).json({ message: "File deleted successfully" });
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Failed to delete file" });
  }
};

// server/routes/fileRoutes.ts
var router6 = Router6();
router6.post("/orders/:orderId/artwork", uploadArtworkImage);
router6.get("/orders/:orderId/artwork", getArtworkImage);
router6.post("/orders/:orderId/preview", saveFramePreview);
router6.get("/orders/:orderId/files", getOrderFilesList);
router6.post("/orders/:orderId/files", uploadOrderFile);
router6.post("/orders/:orderId/artwork-upload", upload.single("artwork"), uploadOrderArtwork);
router6.post("/orders/:orderId/files-upload", upload.single("file"), uploadOrderFile);
router6.get("/orders/:orderId/all-files", getOrderFiles);
router6.delete("/files/:fileId", deleteOrderFile);
var fileRoutes_default = router6;

// server/routes/qrCodeRoutes.ts
import { Router as Router7 } from "express";

// server/controllers/qrCodeController.ts
init_db();
init_schema();
import { randomBytes } from "crypto";
import { eq as eq5, and as and3 } from "drizzle-orm";
function generateQrCode() {
  return `JF${randomBytes(4).toString("hex")}`;
}
async function getAllQrCodes(req, res) {
  try {
    const allQrCodes = await db.select().from(qrCodes).orderBy(qrCodes.createdAt);
    return res.status(200).json(allQrCodes);
  } catch (error) {
    console.error("Error fetching QR codes:", error?.message || error);
    return res.status(500).json({ message: "Error fetching QR codes" });
  }
}
async function getQrCodeById(req, res) {
  try {
    const { id } = req.params;
    const qrCode = await db.select().from(qrCodes).where(eq5(qrCodes.id, parseInt(id))).limit(1);
    if (qrCode.length === 0) {
      return res.status(404).json({ message: "QR code not found" });
    }
    return res.status(200).json(qrCode[0]);
  } catch (error) {
    console.error("Error fetching QR code:", error?.message || error);
    return res.status(500).json({ message: "Error fetching QR code" });
  }
}
async function getQrCodeByCode(req, res) {
  try {
    const { code } = req.params;
    const qrCode = await db.select().from(qrCodes).where(eq5(qrCodes.code, code)).limit(1);
    if (qrCode.length === 0) {
      return res.status(404).json({ message: "QR code not found" });
    }
    return res.status(200).json(qrCode[0]);
  } catch (error) {
    console.error("Error fetching QR code:", error?.message || error);
    return res.status(500).json({ message: "Error fetching QR code" });
  }
}
async function getQrCodesByOrder(req, res) {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }
    const orderQrCodes = await db.select().from(qrCodes).where(
      and3(
        eq5(qrCodes.type, "order"),
        eq5(qrCodes.entityId, orderId)
      )
    );
    const locationQrCodes = await db.select().from(qrCodes).where(
      and3(
        eq5(qrCodes.type, "artwork_location"),
        eq5(qrCodes.entityId, `order-${orderId}`)
      )
    );
    const allQrCodes = [...orderQrCodes, ...locationQrCodes];
    return res.status(200).json(allQrCodes);
  } catch (error) {
    console.error("Error fetching QR codes for order:", error?.message || error);
    return res.status(500).json({ message: "Error fetching QR codes" });
  }
}
async function createQrCode(req, res) {
  try {
    const validatedData = insertQrCodeSchema.parse(req.body);
    if (!validatedData.code) {
      validatedData.code = generateQrCode();
    }
    const existingCode = await db.select({ id: qrCodes.id }).from(qrCodes).where(eq5(qrCodes.code, validatedData.code)).limit(1);
    if (existingCode.length > 0) {
      return res.status(400).json({ message: "QR code already exists" });
    }
    const [newQrCode] = await db.insert(qrCodes).values([validatedData]).returning();
    return res.status(201).json(newQrCode);
  } catch (error) {
    console.error("Error creating QR code:", error?.message || error);
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Invalid QR code data", errors: error.errors });
    }
    return res.status(500).json({ message: "Error creating QR code" });
  }
}
async function recordQrCodeScan(req, res) {
  try {
    const validatedData = insertQrCodeScanSchema.parse(req.body);
    const qrCode = await db.select().from(qrCodes).where(eq5(qrCodes.id, validatedData.qrCodeId)).limit(1);
    if (qrCode.length === 0) {
      return res.status(404).json({ message: "QR code not found" });
    }
    const [scan] = await db.insert(qrCodeScans).values([validatedData]).returning();
    await db.update(qrCodes).set({
      lastScanned: /* @__PURE__ */ new Date(),
      scanCount: qrCode[0].scanCount + 1
    }).where(eq5(qrCodes.id, validatedData.qrCodeId));
    return res.status(201).json(scan);
  } catch (error) {
    console.error("Error recording QR code scan:", error?.message || error);
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Invalid scan data", errors: error.errors });
    }
    return res.status(500).json({ message: "Error recording QR code scan" });
  }
}
async function getQrCodeScans(req, res) {
  try {
    const { id } = req.params;
    const scans = await db.select().from(qrCodeScans).where(eq5(qrCodeScans.qrCodeId, parseInt(id))).orderBy(qrCodeScans.scannedAt);
    return res.status(200).json(scans);
  } catch (error) {
    console.error("Error fetching QR code scans:", error?.message || error);
    return res.status(500).json({ message: "Error fetching QR code scans" });
  }
}
async function linkQrCodeToMaterialLocation(req, res) {
  try {
    const { qrCodeId, materialLocationId } = req.body;
    const qrCode = await db.select().from(qrCodes).where(eq5(qrCodes.id, qrCodeId)).limit(1);
    if (qrCode.length === 0) {
      return res.status(404).json({ message: "QR code not found" });
    }
    const location = await db.select().from(materialLocations).where(eq5(materialLocations.id, materialLocationId)).limit(1);
    if (location.length === 0) {
      return res.status(404).json({ message: "Material location not found" });
    }
    const [updatedLocation] = await db.update(materialLocations).set({ qrCodeId }).where(eq5(materialLocations.id, materialLocationId)).returning();
    return res.status(200).json(updatedLocation);
  } catch (error) {
    console.error("Error linking QR code to material location:", error?.message || error);
    return res.status(500).json({ message: "Error linking QR code to material location" });
  }
}
async function deleteQrCode(req, res) {
  try {
    const { id } = req.params;
    const qrCode = await db.select().from(qrCodes).where(eq5(qrCodes.id, parseInt(id))).limit(1);
    if (qrCode.length === 0) {
      return res.status(404).json({ message: "QR code not found" });
    }
    await db.delete(qrCodeScans).where(eq5(qrCodeScans.qrCodeId, parseInt(id)));
    await db.delete(qrCodes).where(eq5(qrCodes.id, parseInt(id)));
    return res.status(200).json({ message: "QR code deleted successfully" });
  } catch (error) {
    console.error("Error deleting QR code:", error?.message || error);
    return res.status(500).json({ message: "Error deleting QR code" });
  }
}
async function searchQrCodesByEntity(req, res) {
  try {
    const { type, entityId } = req.query;
    if (!type || !entityId) {
      return res.status(400).json({ message: "Type and entityId are required parameters" });
    }
    const qrCode = await db.select().from(qrCodes).where(
      and3(
        eq5(qrCodes.type, type),
        eq5(qrCodes.entityId, entityId)
      )
    ).limit(1);
    if (qrCode.length === 0) {
      return res.status(404).json({ message: "QR code not found" });
    }
    return res.status(200).json(qrCode[0]);
  } catch (error) {
    console.error("Error searching QR code:", error?.message || error);
    return res.status(500).json({ message: "Error searching QR code" });
  }
}

// server/routes/qrCodeRoutes.ts
var router7 = Router7();
router7.get("/qr-codes", getAllQrCodes);
router7.get("/qr-codes/search", searchQrCodesByEntity);
router7.get("/qr-codes/:id", getQrCodeById);
router7.get("/qr-codes/code/:code", getQrCodeByCode);
router7.get("/orders/:orderId/qr-codes", getQrCodesByOrder);
router7.post("/qr-codes", createQrCode);
router7.post("/qr-codes/scan", recordQrCodeScan);
router7.get("/qr-codes/:id/scans", getQrCodeScans);
router7.post("/qr-codes/link-material", linkQrCodeToMaterialLocation);
router7.delete("/qr-codes/:id", deleteQrCode);
var qrCodeRoutes_default = router7;

// server/routes/webhookRoutes.ts
import { Router as Router8 } from "express";

// server/controllers/webhookController.ts
init_storage();
var orderNotificationService2 = new SimpleOrderNotificationService();
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
            await orderNotificationService2.handleOrderEvent({
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
    await orderNotificationService2.handleOrderEvent({
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
var router8 = Router8();
router8.post("/stripe", express.raw({ type: "application/json" }), handleStripeWebhook);
router8.post("/kanban", handleKanbanWebhook);
router8.post("/order-update", handleOrderUpdateWebhook);
router8.get("/health", webhookHealthCheck);
var webhookRoutes_default = router8;

// server/controllers/healthController.ts
var getHealth = (req, res) => {
  res.json({
    status: "healthy",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uptime: process.uptime(),
    environment: "production"
  });
};
var healthController_default = { getHealth };

// server/index.ts
dotenv.config();
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path3.dirname(__filename2);
var app = express2();
var PORT = process.env.PORT || 5e3;
app.use(cors({
  origin: true ? ["https://*.replit.app", "https://*.replit.dev"] : [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://0.0.0.0:5173",
    "https://5173-jayframes-rest-express.replit.dev",
    /^https:\/\/.*\.replit\.dev$/,
    /^https:\/\/.*\.replit\.app$/
  ],
  credentials: true
}));
app.use(express2.json({ limit: "50mb" }));
app.use(express2.urlencoded({ extended: true, limit: "50mb" }));
app.get("/health", healthController_default.getHealth);
app.use("/api", ordersRoutes_default);
app.use("/api", customersRoutes_default);
app.use("/api", inventoryRoutes_default);
app.use("/api", materialsRoutes_default);
app.use("/api", invoiceRoutes_default);
app.use("/api", fileRoutes_default);
app.use("/api", qrCodeRoutes_default);
app.use("/api", webhookRoutes_default);
var clientBuildPath = true ? path3.join(process.cwd(), "dist/public") : path3.join(__dirname2, "../dist/public");
console.log(`\u{1F4C1} Serving static files from: ${clientBuildPath}`);
console.log(`\u{1F4C2} Directory exists: ${__require("fs").existsSync(clientBuildPath)}`);
app.use(express2.static(clientBuildPath, {
  index: "index.html",
  redirect: false
}));
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path3.join(clientBuildPath, "index.html"), (err) => {
    if (err) {
      console.error("Error serving index.html:", err);
      res.status(500).send("Server Error");
    }
  });
});
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message
  });
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`\u{1F680} Server running on http://0.0.0.0:${PORT}`);
  console.log(`\u{1F4C1} Serving static files from: ${clientBuildPath}`);
  console.log(`\u{1F30D} Environment: ${"production"}`);
});
var index_default = app;
export {
  index_default as default
};
