# Pane by Halo-Digital

This package contains a side pane with the following features:

- Horizontal and vertical Resizing

- Horizontal and vertical scrolling

- Close button

Enjoy!


## Attributes

##### horizontalResize
<sub>Declare if the pane will be resizable horizontally and where to place the resize bar</sub>  
<sub>**Type:** 'right' | 'left'</sub>
<sub>**Default:** null</sub>
<br />

##### verticalResize
<sub>Declare if the pane will be resizable vertically and where to place the resize bar</sub>  
<sub>**Type:** 'top' | 'bottom'</sub>  
<sub>**Default:** null</sub>
<br />

##### state
<sub>The pane state</sub>  
<sub>**Type:** 'opened' | 'closed'</sub>  
<sub>**Default:** 'opened'</sub>
<br />

##### showCloseButton
<sub>Declare if close button will appear in the right top corner</sub>  
<sub>**Type:** boolean</sub>  
<sub>**Default:** true</sub>
<br />


## Events

##### stateChange
<sub>Triggers on state change</sub>  
<sub>**Event Parameter Type:** 'opened' | 'closed'</sub>
<br />

##### sizeChange
<sub>Triggers on size change</sub>  
<sub>**Event Parameter Type:** {dimension: 'width' | 'height', value: string}</sub>
<br />


## Example

```
<halo-pane
    horizontalResize="right"
    verticalResize="bottom"
    state="opened"
    [showCloseButton]="false"
    (stateChange)="stateChanged($event)"
    (sizeChange)="sizeChanged($event)">

    <div>Some content</div>

</halo-pane>
```
