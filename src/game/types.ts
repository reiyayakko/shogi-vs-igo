
export type Values<T> = T[keyof T];

export type Pos = number | "stand";

export interface Vec2 {
    x: number;
    y: number;
}
