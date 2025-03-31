export interface letterTile {
    points: number;
    letter: string;
    id: number;
    isDndShadowItem?: boolean;
};

export interface boardTile {
    type: string;
    multipliyer: number;
    id: number;
    color: string;
    dragDisabled: boolean;
    letter: letterTile | null;
    value: number;
};