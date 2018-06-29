

/**
 * 
 * @param {*} usertype 
 *  client = client chat box
 *  user   = staff chat box 
 * 
 *  TODO
 *  - validation on regitration
 *  - set marker if user is online, (must perform async update on view) 
 */
    var baseurl = "http://localhost:54314/";
    var currentclient = "none";
    var currentuser = "none";

    var currentthread = 0;

    /**
     * Timer , infinite loop
    **/
    var myTimer;
    
    /*
     *  Initial 
     */
    function loadinitial() {

        //setup notification
        Notification.requestPermission(function (status) {
            console.log('Notification permission status:', status);
        });

        if (window.webkitNotifications) {
            console.log('Your web browser does support notifications!');
        } else {
            console.log('Your web browser does not support notifications!');
        }

        toggleScreen();
        //checkCookie();

        //createCookie("client,", "client@gmail.com", 1);
        //createCookie("user,", "user@gmail.com", 1);
        //readCookie(client);

    }
    

    function appendText() {
        console.log("append text");
        var usertype = "client";

        var message = document.getElementById('textfield').value;
        document.getElementById('textfield').value = "";

        //use the correct image for the different type of user
        if (usertype == "client") {
            var userimg = baseurl + "Content/img/user.png";
        } else {
            usertype = "user";
            var userimg = baseurl + "Content/img/user.png";
        }
        
        //create chat html message to be added in the chat box
        var txt1 = "<div class='chat'>";

        var txt2 = "<div class='" + usertype + "'>";
        var txt3 = "<img src='" + userimg + "' class='user-photo " + usertype + "' >";
        var txt4 = "</div>";

        var txt5 = "<div class='chat-message " + usertype + "' >";
        var txt6 = "<p> " + message + " </p>";
        var txt7 = "</div>";

        var txt8 = "</div>";

        var chatmessage = txt1 + txt2 + txt3 + txt4 + txt5 + txt6 + txt7 + txt8;

        //send message to the db
        sendMessage(currentclient, currentuser, message);

        //update sent message
        updateChat();

        //set read chat to false
        ReadChat(false);
        console.log("append text false");

    }

    /**
        animate scrolling down on chat
    **/
    $('.sendBtn').click(function(event) {
        // Preventing default action of the event
        event.preventDefault();
        // Getting the height of the document
        var n = $('.chatlogs').height();
    
        $('.chatlogs').animate({ scrollTop: n + 500 }, 500);
        //                                       |    |
        //                                       |    --- duration (milliseconds) 
        //                                       ---- distance from the top
    });


    /**
     * hideChat()
     * -minimize the chatbox 
     */
    function hideChat(){
        chat = document.getElementById("chatbox");
        chat.style.display = "none";
        clearInterval(myTimer);
    }

    /**
     * OpenChat()
     * -open the chatbox 
     */
    function openChat() {
        //check if the user has logged in today by checking the cookie
        //checkCookie();
        //alert(currentclient);

        if (currentclient == "none" || currentclient == null) {
            chatmodal.style.display = "block";
        } else {
            chat = document.getElementById("chatbox");
            chat.style.display = "block";
            myTimer = setInterval(updateChat, 1000);    //run timer to update chat
        }
    }

    /**
     *  Handles when user press enter while typing on chat
    **/
    var input = document.getElementById("textfield");

    input.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("sendBtn").click();
        }
    });


    /**
     * Handles the popup modal for initial registration
     **/

    // Get the modal
    var chatmodal = document.getElementById('chat-popout-modal');

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementById("modal-close");

    // When the user clicks on the button, open the modal
    btn.onclick = function () {
        chatmodal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        chatmodal.style.display = "none";
    }

    function closeModal(){
        chatmodal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == chatmodal) {
            chatmodal.style.display = "none";
        }
    }

    /*
     *  Register new User
     */
    function registernewUser() {

        var clientEmail = document.getElementById("client-email").value;

        if (validate()) {
            if (checkUserExist(document.getElementById("client-email").value) == true) {
                // proceed to chat with the email
                console.log("proceed to chat");

                currentclient = clientEmail;
                currentuser = clientEmail;

                var modalpop    = document.getElementById("chat-popout-modal");
                modalpop.style.display = "none";

                //save clientEmail to cookie,
                //will expire in 1 day
                //setCookie("clientEmail", currentclient);
                //setCookie("userEmail", currentuser);

                //open chatbox
                openChat();

            } else {
                // create a new user with a new chat thread with the email
                console.log("proceed to register new user");

                addNewUser()    //add new user 

                //wait for 4 seconds for the server to process
                $("body").css("cursor", "progress");
                wait(4000);
                $("body").css("cursor", "default");

                console.log("new user added");
                //update current user by client email
                currentclient = clientEmail;
                currentuser = clientEmail;

                var modalpop = document.getElementById("chat-popout-modal");
                modalpop.style.display = "none";

                //save clientEmail to cookie,
                //will expire in 1 day
                //setCookie("clientEmail", currentclient);
                //setCookie("userEmail", currentuser);

                console.log("cookie of user added");

                //create a new chat and chat thread
                CreateNewChat(currentclient);
                console.log("new chat added");

                //wait for 1 seconds for the server to process
                $("body").css("cursor", "progress");
                wait(1000);
                $("body").css("cursor", "default");

                console.log("adding new user successful.");

                //open chatbox
                openChat();

                var adminEmail = "admin@gmail.com";
                var adminMessage = "Hello, How can I help you?";

                //send inital message using sender adminemail
                sendMessage(currentclient, adminEmail, adminMessage);
            }
        }
    }

    function addNewUser() {

        var clientFname = document.getElementById("client-fname").value;
        var clientLname = document.getElementById("client-lname").value;
        var clientEmail = document.getElementById("client-email").value;
        var clientMobile = document.getElementById("client-mobile").value;
        //alert(clientFname + " " + clientLname + " " + clientEmail);
        console.log("Client FirstName: " + clientFname);
        console.log("Client LastName: " + clientLname);
        console.log("Client Email: " + clientEmail);
        console.log("Client Mobile: " + clientMobile);

        var JSONObject = {
            "fname": clientFname,
            "lname": clientLname,
            "email": clientEmail,
            "mobile": clientMobile
        }

        var jsonData = JSON.parse(JSON.stringify(JSONObject));

        //adds new user
        var request = $.ajax({
            url: "ChatService.asmx/addNewUser",
            type: "POST",
            data: jsonData,
            dataType: "json"
        });
    }

    /**
     *  Create a new chat
     *  parameters: client email
    **/
    function CreateNewChat(clientEmail) {
        console.log("creating new chat: " + clientEmail);

        var JSONObject = {
            "email": clientEmail,
            "isRead": false
        }

        var jsonData = JSON.parse(JSON.stringify(JSONObject));

        var request = $.ajax({
            url: "ChatService.asmx/CreateNewChat",
            type: "POST",
            data: jsonData,
            dataType: "json"
        });
    }

    /**
     *  Send message to the chat with parameters client Email, 
     *  sender Email, and Message. Client Email serves as the id
     *  to find the Chat Id. Date and time of time sent are processed
     *  on the server side.
    **/
    function sendMessage(clientEmail, senderEmail, Message) {

        var MessageObject = {
            "cEmail": clientEmail,
            "sEmail": senderEmail,
            "message": Message
        }

        var jsonData = JSON.parse(JSON.stringify(MessageObject));

        var request = $.ajax({
            url: "ChatService.asmx/sendMessage",
            type: "POST",
            data: jsonData,
            dataType: "json"
        });

    }

    /**
     * Get messages list from the given client email.
     * Client email is used to find the clientid which 
     * is the remarks in Chat Table (db).
    **/

    function updateChat() {

        //get all feeds from the clent
        console.log("getting feed from current client:" + currentclient);

        //create a Object to hold the json data
        var MessageObject = {
            "clientEmail": currentclient,
        }

        //convert object to Json object
        var jsonData = JSON.parse(JSON.stringify(MessageObject));

        //get server read web service url for admin
        var url = baseurl + "ChatService.asmx/getMessage";

        //Send POST to update the isRead status in the server
        var response = $.ajax({
            type: "GET",
            url: url,
            data: jsonData,
            dataType: "json",
            async: false,
            cache: false
        }).responseText;

        //console.log(JSON.parse(JSON.stringify(response)));

        var thread = JSON.parse(response);

        //get number of messages in the chat thread
        var threadcount = thread["MessageThread"].length;
        
        //remove previous messages to reset
        $('.chat').remove();

        //add all messages to the chat box
        currentthread = 0;
        for (var i = 0; i < threadcount; i++) {

            //console.log(currentthread + " of " + threadcount);

            var userMsg = thread["MessageThread"][i]["Message"];
            var userfname = thread["MessageThread"][i]["Userfname"];
            var userlname = thread["MessageThread"][i]["Userlname"];
            var userType = thread["MessageThread"][i]["UserType"];
            var userDt = thread["MessageThread"][i]["DT"];
            //console.log(userType);

            addMessage(userType, userDt, userMsg);
            currentthread++;
        }

        //update chat message to read if admin is current user
        if (currentuser == "admin@gmail.com") {
            ReadChat(true);
            console.log("readchat" + currentuser);
            document.getElementById("chattitle").textContent = "Live Chat: " + currentclient;
        } else {

            document.getElementById("chattitle").textContent = "Live Chat: ";   //sent to admin
        }
    }
    
    /**
     * display message to the chat box
    **/
    function addMessage(usertype,dt,message) {

        if (usertype == "client") {
            var userimg = baseurl + "Content/img/client.png";
        } else {
            usertype = "user";
            var userimg = baseurl + "Content/img/user.png";
        }

        //create the message chat to be added to the chatbox
        var txt1 = "<div class='chat'>";

        var txt2 = "<div class='" + usertype + "'>";
        var txt3 = "<img src='" + userimg + "' class='user-photo " + usertype + "' >";
        var txt4 = "</div>";

        var txt5 = "<div class='chat-message " + usertype + "' >";
        var txt6 = "<p> " + message + " </p>";
        var txt7 = "</div>";

        var txt8 = "</div>";

        //append all text with html values
        var chatmessage = txt1 + txt2 + txt3 + txt4 + txt5 + txt6 + txt7 + txt8;

        $(".chatlogs").append(chatmessage);     // Append new elements
    }
    
    /**
     *  Cookie for storing user details
    **/
    function setCookie(cookiename,value) {
        var d = new Date();
        var exdays = 1; //one day until expires
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cookiename + " = " + value + ";" + expires + ";path=/";
    }

    /**
     *  get cookie value using the cookie name
    **/
    function getCookie(cookiename) {
        var cname = cookiename;
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    /**
     *  Check and get current client by its cookie
    **/

    function checkCookie() {
        var user = getCookie("userEmail");
        var client = getCookie("clientEmail");
        if (user != "") {
         //   alert("Welcome again " + user);
            currentclient = client;
            currentuser = user;
        } else {
            //if cookie not found enter your registration info
        }
    }

    /**
     *  Clear cookie from local storage
     **/
    function clearCookie() {
        document.cookie = "clientEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    
    /**
     * check if the user email is registered. 
    **/
    function checkUserExist(clientEmail){

        //create a Object to hold the json data
        var MessageObject = {
            "clientEmail": clientEmail,
        }

        //convert object to Json object
        var jsonData = JSON.parse(JSON.stringify(MessageObject));

        //get server read web service url for admin
        var url = baseurl + "ChatService.asmx/getClientExist";

        //Send POST to update the isRead status in the server
        var response = $.ajax({
            type: "GET",
            url: url,
            data: jsonData,
            dataType: "json",
            async: false,
            cache: false
        }).responseText;

        //parse result from the json object
        var QueryResult = JSON.parse(response);

        //get email from the result object
        var doesEmailExist = QueryResult["Result"]["0"]["Exist"];

        console.log(doesEmailExist);

        return doesEmailExist;
    }


    /**
     *  pause
    **/
    function wait(ms) {
        var start = new Date().getTime();
        var end = start;
        while (end < start + ms) {
            end = new Date().getTime();
        }
    }


    /**
     *  Reply button
    **/
    function reply(chatid) {
        //open chat
        //set current user to admin
        //get recipient from the given chat id
        console.log(chatid);                
        currentuser = getClientEmail(1);    //admin - admin@gmail.com
        currentclient = getClientEmail(chatid); //get client email

        //clear cookie
        //clearCookie();

        //set user cookie to admin
        //setCookie("userEmail", currentuser);
        //set client cookie to current client
        //setCookie("clientEmail", currentclient);

        //open chat
        openChat();

        console.log("admin reply");
        console.log("current user:" + currentuser);
        console.log("current client:" + currentclient);
    }

    /* 
     *  get client email with the userid
     */
    function getClientEmail(userid) {

        //create a Object to hold the json data
        var MessageObject = {
            "userid": parseInt(userid),
        }

        //convert object to Json object
        var jsonData = JSON.parse(JSON.stringify(MessageObject));

        //get server read web service url for admin
        var url = baseurl + "ChatService.asmx/getClientEmail";

        //Send POST to update the isRead status in the server
        var response = $.ajax({
            type: "GET",
            url: url,
            data: jsonData,
            dataType: "json",
            async: false,
            cache: false
        }).responseText;

        //parse result from the json object
        var QueryResult = JSON.parse(response);

        //get email from the result object
        var clientEmail = QueryResult["Result"]["0"]["Email"];

        console.log("clientEmail: " + clientEmail);

        return clientEmail;
    }

    /**
     *  Update status on the chat table to isActive to true
     *  if status is true, the admin have read the chat message,
     *  if status is false, the client have sent a new message
     **/
    function ReadChat(status) {

        console.log("Update read" + currentclient);

        //create a Object to hold the json data
        var MessageObject = {
           "clientEmail": currentclient,
        }

        //convert object to Json object
        var jsonData = JSON.parse(JSON.stringify(MessageObject));

        //url variable
        var url;

        //check if the status,
        if (status == "true" || status == true) {

            //true = read message as admin
            console.log("status " + status);

            //get server read web service url for admin
            url = baseurl + "ChatService.asmx/ReadChatAdmin";

            //Send POST to update the isRead status in the server
            console.log(url);
            var request = $.ajax({
                type: "POST",
                url: url,
                data: jsonData,
                dataType: "json",
            });


        } else {

            //true = read message as admin
            console.log("status " + status);

            //get server read web service url for client
            url = baseurl + "ChatService.asmx/ReadChatClient";

            //Send POST to update the isRead status in the server
            console.log(url);
            var request = $.ajax({
                type: "POST",
                url: url,
                data: jsonData,
                dataType: "json",
            });

        }

    }
    
    /**
      *  Update status on the chat table to isActive to true
    **/
    function UserIsActive() {

    }
    
    /*
     *  Create a generic cookie with parameters 
     *  name  = cookie name
     *  value = cookie value for the cookie name
     *  days  = expiration period of the cookie
     */
    function createCookie(name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        }
        else var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    /*
     *  Get the cookie value based on the cookie name 
     *  name  = cookie name
     */
    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }


    /**
     * Validate Email
     * check if the argument email have 
     * the email format : [string]@[string].[string]
     */
    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    
    /*
     * Validate input (on registration)
     * check if the email is valid or not null/empty
     * check if the number is a number or not null
     * returns false if so.
     */
    function validate() {

        //valid flag, true if email and number 
        //fields are valid, if not return false
        var valid = true;

        //Get email fields and text labels
        var $result = $("#result");
        var email = $("#client-email").val();
        $result.text("");

        //Get number fields and text labels
        var $resultnumber = $("#resultmobile");
        var number = $("#client-mobile").val();
        $resultnumber.text("");

        //validate email
        if (validateEmail(email) || email == null || email == "") {
        } else {
            $result.text(":" + email + " is not valid");
            $result.css("color", "red");
            valid = false;
        }

        //validate number
        if (isNaN(number) || number == null) {
            $resultnumber.text(":" + number + " is not valid ");
            $resultnumber.css("color", "red");
            valid = false;
        } 
        
        return valid;
    }
