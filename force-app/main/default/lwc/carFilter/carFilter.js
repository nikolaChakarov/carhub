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
import CARS_FILTERED_MESSAGE from '@salesforce/messageChannel/CarsFiltered__c';
import { publish, MessageContext } from 'lightning/messageService';


export default class CarFilter extends LightningElement {
    filters={
        searchKey: '',
        maxPrice: 999999,
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
        // this.debounce('searchKey', val, 500);
        this.filters = {...this.filters, searchKey: val}
        this.sendDataToCarList();
    }
    
    handleMaxPriceChange(e) {
        const val = e.target.value;
        // this.debounce('maxPrice', val, 1000);
        this.filters = {...this.filters, maxPrice: val}
        this.sendDataToCarList();
    }
    
    handleCheckbox(e) {
        if (!this.filters.categories) {
            const categories = this.categories.data.values.map(el => el.value);
            const makeType = this.makeType.data.values.map(el => el.value);
            
            this.filters = {...this.filters, categories, makeType};
        }
        
        const { name, value } = e.target.dataset;
        
        if (e.target.checked) {
            if (!this.filters[name].includes(value)) {
                this.filters[name] = [...this.filters[name], value];
            }
        } else {
            this.filters[name] = this.filters[name].filter(el => el !== value);
        }

        // console.log(JSON.stringify(this.filters));

        // this.debounce(name, this.filters[name], 1000);
        this.sendDataToCarList();
    }
    
    sendDataToCarList() {
        window.clearTimeout(this.timer);

        this.timer = window.setTimeout(() => {
            publish(this.messageContext, CARS_FILTERED_MESSAGE, { filters: this.filters });
        }, 500);
    }

    // debounce(field, val, delay) {
    //     window.clearTimeout(this.timer);

    //     this.timer = setTimeout(() => {
    //         this.filters = {...this.filters, [field]: val};
    //         this.sendDataToCarList();
    //     }, delay);
    // }

}