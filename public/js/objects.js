

/*Create object constructor for message data*/
function messageAgent(firstName, lastName, email){
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.blankHtml =  '<!DOCTYPE html><html><head></head><body><div id="msgData"</div></body></html>';

    this.packageMessage = function(){

    };
}



