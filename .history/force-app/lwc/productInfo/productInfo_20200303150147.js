import { LightningElement } from 'lwc';


    // if you have Dynamic URL Use (window.location.href)
    let testURL = window.location.href;

    console.log(testURL);
    
    let newURL = new URL(testURL).searchParams;
    
    console.log('id ===> '+newURL.get('id'));
    console.log('image ====> '+newURL.get('image'));

export default class CreateCommunityUser extends LightningElement {




}