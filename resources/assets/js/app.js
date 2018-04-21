


require('./bootstrap');

window.Vue = require('vue');

//for auto scroll 
import Vue from 'vue'
import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)



//for notificatiuons
import Toaster from 'v-toaster'
import 'v-toaster/dist/v-toaster.css'
Vue.use(Toaster, {timeout: 5000})


Vue.component('message', require('./components/MessageComponent.vue'));


const app = new Vue({
    el: '#app',
    data:{
    	message:'',
      typing : '',

      numberOfUsers:0,
    	chat:{
    		message:[],
    		user:[],
        color:[],
        time:[]
    	},
      
    },
    watch:{
      message(){
            Echo.private('chat')
        .whisper('typing', {
            name: this.message
        });
      } 
    },
    methods:{
    	send(){
    		if (this.message.length!=0) {
    		//console.log(this.message);
    		this.chat.message.push(this.message);
    		this.chat.user.push('you');
        this.chat.color.push('success');
        this.chat.time.push(this.getTime());
    		axios.post('http://127.0.0.1:8000/send',{
           	  message:this.message,
              chat:this.chat
           })
           .then(response=>{
           	   console.log(response);
           	    this.message=''
           })
           .catch(error=>{
           	
           	console.log(this.error);
           
           });

    	  }
    	},
      getTime(){
        let time = new Date();
        return time.getHours()+':'+time.getMinutes()
      },
       getOldMessages(){
            axios.post('http://127.0.0.1:8000/getOldMessage')
                  .then(response => {
                    console.log(response);
                    if (response.data != '') {
                        this.chat = response.data;
                    }
                  })
                  .catch(error => {
                    console.log(error);
                  });
        },
        deleteSession(){
            axios.post('http://127.0.0.1:8000/deleteSession')
            .then(response=> this.$toaster.success('Chat history is deleted') );
        }

    },
    mounted(){
      this.getOldMessages();
    	Echo.private('chat')
      .listen('ChatEvent', (e) => {
    	this.chat.message.push(e.message);
      this.chat.user.push(e.user);
      this.chat.color.push('warning');
      this.chat.time.push(this.getTime());
      axios.post('http://127.0.0.1:8000/saveToSession',{
          chat : this.chat
       })
            .then(response => {
            })
            .catch(error => {
              console.log(error);
            });
         // console.log(e);     
       })

     
    .listenForWhisper('typing', (e) => {
        if (e.name != '') {
          this.typing = 'typing...';
        console.log('typing');
      }else{
        this.typing = '';
        console.log('');
      }
    });
     
     Echo.join(`chat`)
    .here((users) => {
      this.numberOfUsers = users.length;
       console.log(users);
    })
    .joining((user) => {
       this.numberOfUsers +=1;
       this.$toaster.success(user.name+ ' is joined the chat room.');
        console.log(user.name);
    })
    .leaving((user) => {
      this.numberOfUsers -=1;
      this.$toaster.warning(user.name+ ' is Leaved the chat room.')
        console.log(user.name);
    });

    }
});
