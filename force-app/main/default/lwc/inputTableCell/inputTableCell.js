import { LightningElement, api } from 'lwc';
import getPickList from '@salesforce/apex/GetAccLicenses.getPickList';

export default class InputTableCell extends LightningElement {
   
    @api record;
    @api field;
    @api fieldType;
    @api type;
    @api objectName;
   // @api options;
    value;
    label;
    fieldoptions ;
    otherValue;
    showInput;
    objectName;


    connectedCallback() {

        console.log('values::' + this.record);

        console.log('field::' + this.field);

        console.log('fieldType::' + this.fieldType);

        console.log('Type::' + this.type);
        
        console.log('Object Name::' + this.objectName);

        this.value = this.record[this.field];
        this.label = this.field;
        this.type = 'text';
    


        if (this.objectName !== undefined && this.isPickList) {

           console.log('condition meets::' + this.isPickList + 'Object Name::' + this.objectName);

            this.getPicklist(this.objectName, this.field);
        }


        /*   console.log(this.options);
           this.fieldoptions = this.options;
           console.log(this.fieldoptions);
       */
    }

    getPicklist(obj, field) {
        getPickList({ objectName: obj, fieldName: field })
            .then(result => {
                if (result) {

                    console.log('Result::' + JSON.stringify(result));

                    let options =[];

                    for (let i = 0; i < result.length; i++) {
                        console.log('id=' + result[i]);
                        options.push({ value: result[i], label: result[i] });
                        console.log('Field Options::' + JSON.stringify(options));
                    }

                    this.fieldoptions = options;

                    console.log('Field Options::' + JSON.stringify(this.fieldoptions));
                    this.error = undefined;
                }
            })
            .catch(error => {
                this.message = undefined;
                this.error = error;

                console.log('Error Message::' + JSON.stringify(this.error));
            });
    }

    get isPickList() {

        console.log('Field Type::' + this.fieldType);

        if (this.fieldType) {

            console.log('Return True::' + this.fieldType.toLowerCase());
            return this.fieldType.toLowerCase() == 'picklist';
        }
        return false;
    }


    handleChange(event) {

        console.log(event.target.value);
        this.value = event.target.value;

        if (this.value == "Other") {
            console.log('Other Value::' + this.value);
            this.showInput = true;
        }


    }

    handleInputChange(event) {
        console.log('Value ::' + event.target.value + 'Label::' + event.target.name);

        this.otherValue = event.target.value;
    }

    @api
    inputValue() {
        return { value: this.value, field: this.field, otherfield: this.otherValue };
    }
    get isText() {
        if (this.fieldType) {
            return this.fieldType.toLowerCase() == 'text';
        }
        return false;
    }
}