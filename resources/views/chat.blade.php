<!DOCTYPE html>
<html lang="en">
<head>
	<meta name="csrf-token" content="{{ csrf_token() }}">
	<meta charset="UTF-8">
	<title>Document</title>
	<link rel="stylesheet" href="{{ asset('css/app.css') }}">
	<style>
		.list-group{
			overflow-y: scroll;
			height: 200px;
		}
	</style>
</head>
<body>

   <div class="container">
   	  <div class="row" id="app">
   	  	<div class="offset-4 col-4">
   	  		<li class="list-group-item active">Chat Room <span  class="badge badge-danger badge-pill">@{{ numberOfUsers }}</span></li>
   	  		<div class="badge badge-pill badge-primary">@{{ typing }}</div>
   	  		<ul class="list-group" v-chat-scroll>
			
			<message
            v-for="value,index in chat.message"
            :key=value.index
            :color= chat.color[index]
            :user = chat.user[index]
            :time = chat.time[index]
			>
		     @{{ value }} 		
			</message>
		   
		    </ul>
		     <input type="text" class="form-control" placeholder="Type Your Message Here" v-model="message" @keyup.enter="send">
		      <a href='' class="btn btn-warning btn-sm" @click.prevent='deleteSession'>Delete Chats</a>
   	  	</div>
		
      </div>
   </div>




<script type="text/javascript" src="{{ asset('js/app.js') }}"></script>	
</body>
</html>