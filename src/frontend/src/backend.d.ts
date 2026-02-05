import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface MenuItem {
    id: string;
    name: string;
    description: string;
    available: boolean;
    price: bigint;
}
export interface OrderItem {
    menuItem: MenuItem;
    quantity: bigint;
}
export interface ShopSettings {
    logo?: ExternalBlob;
    shopName: string;
}
export interface Order {
    id: string;
    customerName: string;
    status: OrderStatus;
    total: bigint;
    tableNumber: bigint;
    items: Array<OrderItem>;
}
export interface UserProfile {
    name: string;
    role: string;
}
export enum OrderStatus {
    new_ = "new",
    completed = "completed",
    accepted = "accepted"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMenuItem(item: MenuItem): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    authenticateAsOwner(passcode: string): Promise<boolean>;
    deleteMenuItem(itemId: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMenuItems(): Promise<Array<MenuItem>>;
    getOrders(): Promise<Array<Order>>;
    getShopSettings(): Promise<ShopSettings>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(customerName: string, tableNumber: bigint, items: Array<OrderItem>): Promise<Order>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateMenuItem(item: MenuItem): Promise<void>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
    updateShopSettings(name: string, logo: ExternalBlob | null): Promise<void>;
}
