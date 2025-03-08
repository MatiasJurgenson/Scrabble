export interface letterTile {
    points: number;
    letter: string;
    id: number;
};

export interface boardTile {
    type: string;
    multipliyer: number;
    id: number;
    color: string;
    dragDisabled: boolean;
};