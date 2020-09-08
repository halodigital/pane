import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HaloLoadingModule } from '@halodigital/loading-animation';
import { HaloPaneComponent } from './pane.component';


@NgModule({
    declarations: [
        HaloPaneComponent
    ],
    imports: [
        CommonModule,
        HaloLoadingModule
    ],
    exports: [
        HaloPaneComponent
    ]
})

export class HaloPaneModule {}
