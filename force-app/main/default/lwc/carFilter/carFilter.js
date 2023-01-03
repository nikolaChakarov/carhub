import { LightningElement, wire } from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';

// car Schema
import CAR_OBJECT from '@salesforce/schema/Car__c';
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__c';
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c';
// constants
const CATEGORY_ERROR = 'Error loading categories';
const MAKE_ERROR = 'Error loading makes';

export default class CarFilter extends LightningElement {
    filters={
        searchKey: '',
        maxPrice: 999999 
    }

    categoryError = CATEGORY_ERROR;
    makeError = MAKE_ERROR;
    timer;

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
        window.clearTimeout(this.timer);
        const val = e.target.value;

        this.timer = setTimeout(() => {
            this.filters = {...this.filters, 'searchKey': val};
        }, 500);
    }
    
    handleMaxPriceChange(e) {
        this.filters = {...this.filters, 'maxPrice': e.target.value}
    }

    handleCheckbox(e) {
        const { name, value } = e.target.dataset;

        console.log(name, ' ', value);
    }

}