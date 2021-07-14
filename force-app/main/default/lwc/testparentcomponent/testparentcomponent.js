import { LightningElement ,track} from 'lwc';

export default class Testparentcomponent extends LightningElement {

  handlechildevent(event){
    const childcompname=event.detail.childcompname;
    const childcompdescription=event.detail.childcompdescription;
    alert('Event handled in Parent Comp');
    alert('child comp name is:'+childcompname);
    alert('child comp description is:'+childcompdescription);
    console.log('childcompname: ' + childcompname)
    console.log('childcompdescription: ' + childcompdescription)
  }

}