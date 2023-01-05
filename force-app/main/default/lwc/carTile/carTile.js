import { LightningElement, api } from 'lwc';

export default class CarTile extends LightningElement {
    @api carr={};

    handleClick() {
        // Create event with the contact ID;
        const selectedEvent = new CustomEvent('selected', { detail: this.carr.Id });

        // Dispatches the event;
        this.dispatchEvent(selectedEvent);
    }
}