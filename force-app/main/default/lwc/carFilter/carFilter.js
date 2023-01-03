import { LightningElement, wire } from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';

// car Schema
import CAR_OBJECT from '@salesforce/schema/Car__c';
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__c';
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c';
// constants
const CATEGORY_ERROR = 'Error loading categories';
const MAKE_ERROR = 'Error loading makes';

// Lightnin Message Service and a message channel;
import CARS_FILTERED_MESSAGE from '@salesforce/messageChannel/carsFiltered__c';
import { publish, MessageContext } from 'lightning/messageService';


export default class CarFilter extends LightningElement {
    filters={
        searchKey: '',
        maxPrice: 999999 
    }

    categoryError = CATEGORY_ERROR;
    makeError = MAKE_ERROR;
    timer;

    /**Load context for LMS */
    @wire(MessageContext)
    messageContext;

    @wire(getObjectInfo, { objectApiName: CAR_OBJECT})
    carObjectInfo;
        
    /***fetching Category picklist*/
    @wire(getPicklistValues, {
        recordTypeId: '$carObjectInfo.data.defaultRecordTypeId',
        fieldApiName: CATEGORY_FIELD
    })
    categories;

    /***fetching Category picklist*/
    @wire(getPicklistValues, {
        recordTypeId: '$carObjectInfo.data.defaultRecordTypeId',
        fieldApiName: MAKE_FIELD
    })
    makeType;
   

    handleSearchKeyChange(e) {
        const val = e.target.value;
        this.debounce('searchKey', val, 500);
    }
    
    handleMaxPriceChange(e) {
        const val = e.target.value;
        this.debounce('maxPrice', val, 1000);
    }

    handleCheckbox(e) {
        const { name, value } = e.target.dataset;

        console.log(JSON.stringify(this.categories.data.values));

    }

    sendDataToCarList() {
        publish(this.messageContext, CARS_FILTERED_MESSAGE, { filters: this.filters });
    }

    debounce(field, val, delay) {
        window.clearTimeout(this.timer);

        this.timer = setTimeout(() => {
            this.filters = {...this.filters, [field]: val};
            this.sendDataToCarList();
        }, delay);
    }

}