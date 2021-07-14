import { LightningElement, track, api, wire  } from 'lwc';

export default class DynamicTable extends LightningElement {
    @api columnList;
    @api title;
    @track columns;
    @track objectAPIName;
    @track pickListvalues;
    @track rows = [{ uuid: this.createUUID()}];
    connectedCallback() {
        let cleanedColumnList = this.columnList[0] === '\\' ? this.columnList.substring(1) : this.columnList;

        console.log(
            'cleaned columns list::' + JSON.stringify(cleanedColumnList)
        );

        if(cleanedColumnList)
        {
            console.log('It is not null');

            this.columns = cleanedColumnList;
        }
    }

    createUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
    }

    @api
    retrieveRecords() {

        console.log('Data has retrieved');

        let rows = Array.from(this.template.querySelectorAll("tr.inputRows") );
        var records=[];
        rows.map(row => {
            let texts = Array.from(row.querySelectorAll(".fields"));

            console.log('texts data coming from input field::' + texts);

            if(texts)
            {
                var textVal=this.fieldValues(texts);
                records=[...records,textVal];
            }
        });
        return records;
    }
    fieldValues(cells)
    {

        console.log('Cell Value' +JSON.stringify(cells));

        console.log('Cells Definition' + cells);
        
        return cells.reduce((record, cell) => {
            let inputVal = cell.inputValue();
            if(inputVal.value!=undefined)
            {
                console.log('inputVal.Value::' + inputVal.value + 'inputVal::'+ JSON.stringify(inputVal)) ;
                console.log('inputVal.field::' + inputVal.field + 'other input value::' + inputVal.otherfield );
                record[inputVal.field] = inputVal.value ;
            }
            return record;
        }, {});
    }
    removeRow(event) {
        this.rows.splice(event.target.value, 1);
    }
    
    addRow() {
        this.rows.push({ uuid: this.createUUID()});
    }
}   