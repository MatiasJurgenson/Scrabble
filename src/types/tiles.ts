export interface letterTile {
    points: number;
    letter: string;
    id: string;
};

export interface boardTile {
    type: string;
    multipliyer: number;
    letter?: letterTile;
    id: number;
    color: string;
};