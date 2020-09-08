import { Component, ElementRef, EventEmitter, HostBinding, Input, Output, ViewChild } from '@angular/core';
import { HaloPaneDimension, HaloPaneDirection, HaloPaneHorizontalSide, HaloPaneSizeChangeEvent, HaloPaneState, HaloPaneVerticalSide } from './pane';


@Component({
    selector: 'halo-pane',
    templateUrl: './pane.component.html',
    styleUrls: ['./pane.component.scss']
})

export class HaloPaneComponent {

    isLoading: boolean;

    private cachedTransitionStyle: string;
    private cachedSize: string;
    private cachedMinSize: string;

    private _horizontalResize: HaloPaneHorizontalSide;
    private _verticalResize: HaloPaneVerticalSide;
    private _state: HaloPaneState;
    private _showCloseButton: boolean;

    @ViewChild('content', {static: true}) contentElement: ElementRef;

    @Output() stateChange: EventEmitter<HaloPaneState> = new EventEmitter<HaloPaneState>();
    @Output() sizeChange: EventEmitter<HaloPaneSizeChangeEvent> = new EventEmitter<HaloPaneSizeChangeEvent>();

    @HostBinding('class.halo-pane-horizontal-closed')
    get horizontalClosedClass(): boolean {

        return this.state === HaloPaneState.Closed && !!this.horizontalResize;

    }

    @HostBinding('class.halo-pane-vertical-closed')
    get verticalClosedClass(): boolean {

        return this.state === HaloPaneState.Closed && !!this.verticalResize && !this.horizontalResize;

    }

    @Input()
    get horizontalResize(): HaloPaneHorizontalSide {

        return this._horizontalResize;

    }
    set horizontalResize(horizontalResize: HaloPaneHorizontalSide) {

        this._horizontalResize = horizontalResize;

    }

    @Input()
    get verticalResize(): HaloPaneVerticalSide {

        return this._verticalResize;

    }
    set verticalResize(verticalResize: HaloPaneVerticalSide) {

        this._verticalResize = verticalResize;

    }

    @Input()
    get state(): HaloPaneState {

        return this._state || HaloPaneState.Opened;

    }
    set state(state: HaloPaneState) {

        this._state = state;

    }

    @Input()
    get showCloseButton(): boolean {

        return this._showCloseButton === false ? false : true;

    }
    set showCloseButton(showCloseButton: boolean) {

        this._showCloseButton = showCloseButton;

    }

    constructor(public host: ElementRef) {}

    open(): void {

        if (this.state === HaloPaneState.Closed) {

            const dimension = this.horizontalResize ? HaloPaneDimension.Width : HaloPaneDimension.Height;
            const minDimension = this.horizontalResize ? 'minWidth' : 'minHeight';

            this.host.nativeElement.style[minDimension] = this.cachedMinSize;
            this.host.nativeElement.style[dimension] = this.cachedSize;

            this.state = HaloPaneState.Opened;

            this.stateChange.emit(this.state);

        }

    }

    close(): void {

        if (this.state === HaloPaneState.Opened) {

            const dimension = this.horizontalResize ? HaloPaneDimension.Width : HaloPaneDimension.Height;
            const minDimension = this.horizontalResize ? 'minWidth' : 'minHeight';

            this.cachedSize = getComputedStyle(this.host.nativeElement)[dimension];
            this.cachedMinSize = getComputedStyle(this.host.nativeElement)[minDimension];

            this.state = HaloPaneState.Closed;

            this.stateChange.emit(this.state);

        }

    }

    toggleMinMaxSize(direction: HaloPaneDirection): void {

        const computedStyle = getComputedStyle(this.host.nativeElement);
        const dimension = direction === HaloPaneDirection.Horizontal ? HaloPaneDimension.Width : HaloPaneDimension.Height;
        const strMin = computedStyle['min-' + dimension];
        const strMax = computedStyle['max-' + dimension];
        const strActual = computedStyle[dimension];
        const min = this.getSize(dimension, strMin);
        const max = this.getSize(dimension, strMax);
        const actual = this.getSize(dimension, strActual);
        const maxPadding = 10;

        if ((min && max && actual < max - maxPadding) || (max && !min)) {

            this.host.nativeElement.style[dimension] = max + 'px';
            this.sizeChange.emit({dimension, value: max + 'px'});

        } else if ((min && max && actual >= max - maxPadding) || (!max && min)) {

            this.host.nativeElement.style[dimension] = min + 'px';
            this.sizeChange.emit({dimension, value: min + 'px'});

        }

    }

    fitSizeToContent(): void {

        if (this.horizontalResize) {

            const actualWidth = this.contentElement.nativeElement.clientWidth;
            const scrollWidth = this.contentElement.nativeElement.scrollWidth;

            if (scrollWidth > actualWidth) {
                this.host.nativeElement.style.width = scrollWidth + 7 + 'px';
            }

        }

        if (this.verticalResize) {

            const actualHeight = this.contentElement.nativeElement.clientHeight;
            const scrollHeight = this.contentElement.nativeElement.scrollHeight;

            if (scrollHeight > actualHeight) {
                this.host.nativeElement.style.height = scrollHeight + 'px';
            }

        }

    }

    resize(direction: HaloPaneDirection): void {

        const dimension = direction === HaloPaneDirection.Vertical ? HaloPaneDimension.Height : HaloPaneDimension.Width;

        this.cachedTransitionStyle = this.host.nativeElement.style.transition;
        this.host.nativeElement.style.transition = 'none';

        this.host.nativeElement.onmousemove = this.resizeMouseMove.bind(this, direction, dimension);
        this.host.nativeElement.onmouseup = this.resizeMouseUp.bind(this, dimension);
        this.host.nativeElement.onmouseleave = this.resizeMouseUp.bind(this, dimension);

    }

    private resizeMouseMove(direction: HaloPaneDirection, dimension: HaloPaneDimension, event: MouseEvent): void {

        let movment: number;
        const hostProperties = this.host.nativeElement.getBoundingClientRect();

        if (direction === HaloPaneDirection.Horizontal && this.horizontalResize === HaloPaneHorizontalSide.Right && (event.movementX >= 0 || (event.movementX < 0 && event.x <= hostProperties.x + hostProperties[dimension]))) {
            movment = event.movementX;
        } else if (direction === HaloPaneDirection.Horizontal && this.horizontalResize === HaloPaneHorizontalSide.Left && (event.movementX <= 0 || (event.movementX > 0 && event.x >= hostProperties.x))) {
            movment = -event.movementX;
        } else if (direction === HaloPaneDirection.Vertical && this.verticalResize === HaloPaneVerticalSide.Top && (event.movementY <= 0 || (event.movementY > 0 && event.y >= hostProperties.y))) {
            movment = -event.movementY;
        } else if (direction === HaloPaneDirection.Vertical && this.verticalResize === HaloPaneVerticalSide.Bottom && (event.movementY >= 0 || (event.movementY < 0 && event.y <= hostProperties.y + hostProperties[dimension]))) {
            movment = event.movementY;
        }

        this.host.nativeElement.style[dimension] = hostProperties[dimension] + movment + 'px';

    }

    private resizeMouseUp(dimension: HaloPaneDimension): void {

        this.host.nativeElement.onmousemove = null;
        this.host.nativeElement.onmouseup = null;
        this.host.nativeElement.onmouseleave = null;

        this.host.nativeElement.style.transition = this.cachedTransitionStyle;

        this.sizeChange.emit({dimension, value: this.host.nativeElement.style[dimension]});

    }

    private getSize(dimension: HaloPaneDimension, value: string): number {

        if (value.includes('%')) {

            const percent = +(value.replace('%', '')) / 100;
            return percent * this.host.nativeElement.parentNode.getBoundingClientRect()[dimension];

        }

        if (value.includes('px')) {

            return +value.replace('px', '');

        }

        return 0;

    }

}
