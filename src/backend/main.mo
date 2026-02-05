import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
    role : Text; // "owner" or "customer"
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Type Definitions
  public type MenuItem = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    available : Bool;
  };

  public type OrderItem = {
    menuItem : MenuItem;
    quantity : Nat;
  };

  public type OrderStatus = {
    #new;
    #accepted;
    #completed;
  };

  public type Order = {
    id : Text;
    customerName : Text;
    tableNumber : Nat;
    items : [OrderItem];
    total : Nat;
    status : OrderStatus;
  };

  public type ShopSettings = {
    shopName : Text;
    logo : ?Storage.ExternalBlob;
  };

  // State
  let menuItems = Map.empty<Text, MenuItem>();
  let orders = Map.empty<Text, Order>();
  var shopSettings : ShopSettings = {
    shopName = "Dukandar";
    logo = null;
  };

  var orderCounter : Nat = 0;

  // User Profile Management (Required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Shop Owner Authentication with Passcode
  public shared ({ caller }) func authenticateAsOwner(passcode : Text) : async Bool {
    // Prevent already-authenticated admins from re-authenticating
    if (AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Already authenticated as admin");
    };

    if (passcode != "DUKANDAR") {
      return false;
    };

    // Assign admin role to the caller
    AccessControl.assignRole(accessControlState, caller, caller, #admin);

    // Create owner profile
    let ownerProfile : UserProfile = {
      name = "Shop Owner";
      role = "owner";
    };
    userProfiles.add(caller, ownerProfile);

    return true;
  };

  // Menu Management (Admin Only)
  public shared ({ caller }) func addMenuItem(item : MenuItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add menu items");
    };
    menuItems.add(item.id, item);
  };

  public shared ({ caller }) func updateMenuItem(item : MenuItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update menu items");
    };
    if (not menuItems.containsKey(item.id)) {
      Runtime.trap("Menu item does not exist");
    };
    menuItems.add(item.id, item);
  };

  public shared ({ caller }) func deleteMenuItem(itemId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete menu items");
    };
    if (not menuItems.containsKey(itemId)) {
      Runtime.trap("Menu item does not exist");
    };
    menuItems.remove(itemId);
  };

  // Shop Settings Management (Admin Only)
  public shared ({ caller }) func updateShopSettings(name : Text, logo : ?Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update shop settings");
    };
    shopSettings := {
      shopName = name;
      logo = logo;
    };
  };

  // Orders (Customers can place, Admins can manage)
  public shared ({ caller }) func placeOrder(customerName : Text, tableNumber : Nat, items : [OrderItem]) : async Order {
    // Public access - any user including guests can place orders (walk-in customers)
    // This is intentional for a restaurant ordering system
    if (customerName == "") {
      Runtime.trap("Customer name is required");
    };
    if (tableNumber == 0) {
      Runtime.trap("Table number is required");
    };
    if (items.size() == 0) {
      Runtime.trap("Order must have at least one item");
    };

    var total : Nat = 0;
    for (item in items.values()) {
      total += item.menuItem.price * item.quantity;
    };

    orderCounter += 1;
    let orderId = "order_" # orderCounter.toText();

    let order : Order = {
      id = orderId;
      customerName;
      tableNumber;
      items;
      total;
      status = #new;
    };

    orders.add(order.id, order);
    order;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?existingOrder) {
        let updatedOrder : Order = {
          id = existingOrder.id;
          customerName = existingOrder.customerName;
          tableNumber = existingOrder.tableNumber;
          items = existingOrder.items;
          total = existingOrder.total;
          status;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  // Queries
  public query ({ caller }) func getMenuItems() : async [MenuItem] {
    // Public access - anyone can view menu (including guests)
    menuItems.values().toArray();
  };

  public query ({ caller }) func getOrders() : async [Order] {
    // Admin only - protect order data
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public query ({ caller }) func getShopSettings() : async ShopSettings {
    // Public access - anyone can view shop settings (including guests)
    shopSettings;
  };
};
