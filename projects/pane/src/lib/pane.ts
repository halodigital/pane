export interface HaloPaneSizeChangeEvent {
    dimension: HaloPaneDimension;
    value: string;
}

export enum HaloPaneDirection {
    Horizontal = 'horizontal',
    Vertical = 'vertical'
}

export enum HaloPaneDimension {
    Width = 'width',
    Height = 'height'
}

export enum HaloPaneHorizontalSide {
    Right = 'right',
    Left = 'left'
}

export enum HaloPaneVerticalSide {
    Top = 'top',
    Bottom = 'bottom'
}

export enum HaloPaneState {
    Opened = 'opened',
    Closed = 'closed'
}
