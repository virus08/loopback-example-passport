// http://momentjs.com/
Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('Do MMMM YYYY')
  }
})

/*
Vue.component('test', {
	 props: ['source'],
	 template: '<div>{{ list. }}</div>',
	 data: function () {
	    return {
	    	list: null
	    }
	  },
	  methods: {
		  getUsers: function(){
	            this.$http.get(this.source).then(function(response){
	                this.list = response.data;
	            }, function(error){
	                console.log(error.statusText);
	            });
	        }
	    },
	    mounted: function () {
	        this.getUsers();
	    }
	})


 */



Vue.component('New_Job', {
	props:['name','UID'],
	 template: 
		 `
		 <div class="ibox-content">
          	<div class="text-center">
		 		<a data-toggle="modal" class="btn btn-sm btn-primary pull-right m-t-n-xs" href="#newjob-form">Add Job</a>
		 	</div>
		 </div>
		 `
	})
	
	
Vue.component('c-form', {
	 props: ['f_id','f_name','f_detail','profile'],
	 template: 
		 `
		 <div :id=f_id class="modal fade" aria-hidden="true">
		 	<div class="modal-dialog">
		 		<div class="modal-content">
		 			<div class="modal-body">
		 				<div class="row">
		 					<div class="col-sm-6 b-r"><h3 class="m-t-none m-b">{{f_name}}</h3>
		 						<p>{{f_detail}}</p>
		 						<div class="form-group">
		 							<label>Job Name</label> <input type="string" v-model="timesheet.Job_Header" placeholder="หัวข้องาน"  class="form-control">
		 							<label>Job Detail</label> <input type="string" v-model="timesheet.Job_detail" placeholder="รายละเอียด" class="form-control">
		 							<label>Job Type</label> 
		 							<select class="form-control m-b" v-model="timesheet.Job_Type">
                                        <option v-for="option in jobtype">{{option}}</option>                                       
                                    </select>
                                    <label>Deadline</label> <input type="date" v-model="timesheet.Job_date" placeholder="วันส่งงาน" class="form-control">
                                    <label>Job Hours</label> <input type="number" v-model="timesheet.Job_Hours" placeholder="ชั่วโมง" class="form-control">
		 						</div>		
		 					</div>
		 						<div class="col-sm-6">
		 							<div class="form-group">
		 							<label>Base On Technology</label>
		 								<select class="form-control" multiple="" v-model="timesheet.Base_Technology">
		 									<option v-for="option in tech">{{option}}</option>
		 								</select>
		 							<label>Add contact</label>
		 								<select class="form-control" multiple="" v-model="timesheet.contract">
		 									<option v-for="option in timesheet.contract">{{option}}</option>
		 								</select>
		 								
		 									<input type="string" v-model="newct" placeholder="รายละเอียดผู้ติดต่อ" class="form-control" >
		 							</div>
		 								<div>
		 									<button class="btn btn-sm btn-primary pull-right m-t-n-xs" v-on:click="addct">
		 										<strong>Add contact</strong>
		 									</button>
		 								</div>
		 							
		 							<br><br><br><br><br><br>
		 						</div>
		 						<div>
		 							<button class="btn btn-sm btn-primary pull-right m-t-n-xs" v-on:click="addjob">
		 								<strong>Add Job</strong>
		 							</button>
		 						</div>
		 					
		 				</div>
		 			</div>
		 		</div>
		 	</div>
		 `,
		 data: function () {
			    return {
			    	user: null,
			    	newct:null,
			    	jobtype:[
			    		"Documentation",
			    		"POC with vServe Plus",
			    		"Self POC by VST ECS",
			    		"Comply",
			    		"Trainer",
			    		"Learning Skill",
			    		"Event",
			    		"Present",
			    		"Solution",
			    		"Sales Support",
			    		"Support",
			    		"Operation",
			    		"Traveling",
			    		"Others"
			    	],
			    	tech:[
			    		"Cloud",
			    		"VM Infrastructure",
			    		"Network",
			    		"Security",
			    		"Software",
			    		"Image Process",
			    		"Peripheral",
			    		"None",
			    	],
			    	timesheet:{
			    	    "Name_Surname": "",
			    	    "Job_Type": "",
			    	    "Job_arear": "",
			    	    "Base_Technology": [],
			    	    "UID": 1,
			    	    "Job_Header": "",
			    	    "Job_detail": "",
			    	    "create_date": "",
			    	    "Job_date": "",
			    	    "modify_date": "",
			    	    "Job_Hours": 0,
			    	    "Job_progress": 0,
			    	    "contract": [],
			    	    "Job_status": "Open",
			    	    "remark": [
			    	      "0"
			    	    ]
			    	  }			    	
			    }
			  },
			  methods: {
				  getUsers: function(){
			            this.$http.get(this.profile).then(function(response){
			                this.user = response.data;
			                this.timesheet.Name_Surname= this.user.Name+' '+this.user.Sname
			                this.timesheet.UID= this.user.uid
			                this.timesheet.create_date=new Date()
			                this.timesheet.modify_date=this.timesheet.create_date
			            }, function(error){
			                console.log(error.statusText);
			            });
			        },
			      addjob:function(){
			    	  this.$http.post('http://localhost:3000/api/timesheets',this.timesheet)
			    	  $('#'+this.f_id).modal('hide')
			    	  location.href = "/"
			    	  this.$emit('AddJob')
			      },
			     addct:function(){
			    	 this.timesheet.Job_Hours+=1;
			    	 this.timesheet.contract.push(this.newct);
			     }
			       
			    },
			    mounted: function () {
			        this.getUsers();
			    }
			})

Vue.component('Timesheet', {
	 props: ['source','uid'],
	 template: `<div>
		 	<div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title">
                            <h5>Time sheet</h5>
                        </div>
                        <div class="ibox-content">
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                    <tr>

                                        <th></th>
                                        <th>Job Name</th>
                                        <th>Type</th>
                                        <th>Hours</th>
                                        <th>Deadline </th>
                                        <th>Task</th>
                                        <th>Progress</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="data in list">
                                        <td></td>
                                        <td>{{data.Job_Header}}</td>
                                        <td>{{data.Job_Type}}</td>
                                        <td>{{data.Job_Hours}}</td>
                                        <td>{{data.Job_date | formatDate}}</td>
                                        <td><circle-slider :side="20" :progress-width="10" v-model="data.Job_progress"></circle-slider></td>
                                        <td>{{data.Job_progress}} %</td>
                                     	<td>{{data.Job_status}}</td>
                                        <td>
                                        	<div class="row">
                                        		<div class="col-md-1"><a href="#"><i class="fa fa-pencil-square-o text-navy"></i></a></div>
                                        		<div class="col-md-1"><a href="#"><i class="fa fa-times text-navy"></i></a></div>
                                        		
                                        	</div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                <New_Job></New_Job>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
		 </div>
	 `,
	 data: function () {
	    return {
	    	list: null
	    }
	  },
	  methods: {
		  getUsers: function(){
	            this.$http.get(this.source).then(function(response){
	            	var uid=parseInt(this.uid);
	                this.list = response.data.filter(function (n){
	                    return n.UID===uid;
	                });
	            }, function(error){
	                console.log(error.statusText);
	            });
	        }
	    },
	    mounted: function () {
	        this.getUsers();
	    }
	})



Vue.component('profile', {
  props: ['source'],
  // just like data, the prop can be used inside templates
  // and is also made available in the vm as this.message
  data: function () {
	    return {
	    	profiles: null
	    }
	  },
  methods: {
	getUsers: function(){
		this.$http.get(this.source).then(function(response){
			this.profiles = response.data;
		}, function(error){
			console.log(error.statusText);
		});
	}
  },
  mounted: function () {
	this.getUsers();
  },
  template: `
	<li class="nav-header">
		<center>
		<div class="dropdown profile-element"> 
			<span>
				<img alt="image" class="img-circle" v-bind:src='profiles.picture' />
			</span>
			<span class="clear"> 
				<span class="block m-t-xs"> 
					<strong class="font-bold">{{profiles.Name}} {{profiles.Sname}}</strong>
				</span> 
				<span class="text-muted text-xs block">
				{{profiles.position}}</b>
				</span>
			</span> 
		</div>
		</center>
        <div class="logo-element">
			IN+
		</div>
		
	</li>
`
});



Vue.component('header-layout',{
	template:`
	        <nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0">
        <div class="navbar-header">
            <a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="#"><i class="fa fa-bars"></i> </a>
            <form role="search" class="navbar-form-custom" method="post" action="search_results.html">
                <div class="form-group">
                    <input type="text" placeholder="Search for something..." class="form-control" name="top-search" id="top-search">
                </div>
            </form>
        </div>
            <ul class="nav navbar-top-links navbar-right">
                <slot></slot>
            </ul>
        </nav>
	`
});

Vue.component('logout',{
	template:'<li><a href="auth/logout"><i class="fa fa-sign-out"></i> Log out</a></li>'
});

Vue.component('welcome-message',{
	template:'<li><span class="m-r-sm text-muted welcome-message"><slot></slot></span></li>'
});

Vue.component('app-menus',{
	props: {
		app_href: {
		  type: String,
		  default: '#'
		},
		app_name: {
		  type: String,
		  default: 'Dashboards'
		},
		app_isActive:
		{
		  type: Boolean,
		  default: false
		},
		app_icont:{
			type: String,
			default: 'fa fa-th-large'
		},
		menus:{
			type: Array,
			default: function () {
				return null
			}
		}
	},
	template:`
		<li>
			<a href=app_href  >
				<i :class=app_icont></i> <span class="nav-label">{{app_name}}</span> 
				<span class="fa arrow"></span>
			</a>
			<ul class="nav nav-second-level">
				<li v-for="menu in menus" :class="{'active':menu.isActive}">
					<a :href="menu.href" >{{menu.label}}  </a>
				</li>
			</ul>
        </li>
	`
});

Vue.component('menu-list', {
	props: {
		label:{
			type: String,
			default:'MyMenu'
		},
		href:{
			type: String,
			default:'#'
		}
	},
    template: '<li><a :href=href @click="selectTab(tab)>{{label}}</a></li>'

    })
	
	
Vue.component('profile-menu-list', {
	props: {
		label:{
			type: String,
			default:'MyMenu'
		},
		href:{
			type: String,
			default:'#'
		}
	},
    template: 
	'<li><a :href=href>{{label}}</a></li>'
    })
	
	


