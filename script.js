const CHANNEL_ID = 'oHSivQLOBQ83Xgwd';
const drone = new ScaleDrone(CHANNEL_ID, {
 data: { // Will be sent out as clientData via events
   name: getRandomName(),
   color: getRandomColor(),
 },
});
function getRandomName() {
 const adjs = ["baddie", "crusty", "brocken :(", "rachel", "carpet-gripper", "lemon zest", "carpet cruncher", "purr", "onii", "material gworl", "CRUSTY", "kool-aid water scented"];
 const nouns = ["toes", "gworl", "person", "frog", "wine cork", "bunch-a-balloons", "sea", "morning", "snow", "lake", "sunset", "pine", "leaf"];
 return (
   adjs[Math.floor(Math.random() * adjs.length)] +
   "_" +
   nouns[Math.floor(Math.random() * nouns.length)]
 );
}

function getRandomColor() {
 return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

drone.on('open', error => {
 if (error) {
   return console.error(error);
 }
 console.log('Successfully connected to Scaledrone');
 
 const room = drone.subscribe('observable-room');
 room.on('open', error => {
   if (error) {
     return console.error(error);
   }
   console.log('Successfully joined room');
 });
 
 // More events code to follow..
  let members = [];
  // Put this code into the drone.on('open') block
// right after the room 'open' listener
 
// List of currently online members, emitted once
room.on('members', m => {
 members = m;
 // updateMembersDOM(); uncomment later
});
 
// User joined the room
room.on('member_join', member => {
 members.push(member);
 // updateMembersDOM(); uncomment later
});
 
// User left the room
room.on('member_leave', ({id}) => {
 const index = members.findIndex(member => member.id === id);
 members.splice(index, 1);
 // updateMembersDOM(); uncomment later
});
  // Add this after 'member_leave' event
room.on('data', (text, member) => {
 if (member) {
   addMessageToListDOM(text, member); 
 } else {
   // Message is from server
 }
});
});
 
 membersCount: document.querySelector('.members-count'),
 membersList: document.querySelector('.members-list'),
 messages: document.querySelector('.messages'),
 input: document.querySelector('.message-form__input'),
 form: document.querySelector('.message-form'),
};
 
function createMemberElement(member) {
 const { name, color } = member.clientData;
 const el = document.createElement('div');
 el.appendChild(document.createTextNode(name));
 el.className = 'member';
 el.style.color = color;
 return el;
}
 
function updateMembersDOM() {
 DOM.membersCount.innerText = `${members.length} users in room:`;
 DOM.membersList.innerHTML = '';
 members.forEach(member =>
   DOM.membersList.appendChild(createMemberElement(member))
 );
}
 
function createMessageElement(text, member) {
 const el = document.createElement('div');
 el.appendChild(createMemberElement(member));
 el.appendChild(document.createTextNode(text));
 el.className = 'message';
 return el;
}
 
function addMessageToListDOM(text, member) {
 const el = DOM.messages;
 const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
 el.appendChild(createMessageElement(text, member));
 if (wasTop) {
   el.scrollTop = el.scrollHeight - el.clientHeight;
 }
}
DOM.form.addEventListener('submit', sendMessage);
 
function sendMessage() {
 const value = DOM.input.value;
 if (value === '') {
   return;
 }
 DOM.input.value = '';
 drone.publish({
   room: 'observable-room',
   message: value,
 });
}
