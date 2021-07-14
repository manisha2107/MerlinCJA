import { LightningElement,api } from 'lwc';

export default class Testchildcomponent extends LightningElement {
 
    @api childcompname='Name of comp is childemocomp';
    @api childcompdescription='Description of comp is testing';
    
    
    handlebuttonclick(){
       const evt= new CustomEvent('myfirstevent', {detail:{childcompname:this.childcompname,childcompdescription:this.childcompdescription}});
       this.dispatchEvent(evt);
    }
}