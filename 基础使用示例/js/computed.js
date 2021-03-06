/**
 * 功能：Vue计算属性
 * 日期：2017/4/20
 **/

let app1 = new Vue({
	el: '#app-1',
	data: {
		content: 'ABCDEFG'
	},
	computed: {
		reversedContent: function () {
			return this.content.split('').reverse().join('');
		}
	}
});

let app2 = new Vue({
	el: '#app-2',
	data: {
		nowtime: '点击获取当前时间'
	},
    methods: {
		getNowTime: function () {
            // 日期数据更新
            this.nowtime = new Date().toLocaleString();
            // 样式修改
			let timer = this.$refs.timer;
			timer.classList.add('text-success');
		}
	}
});

let app3 = new Vue({
	el: '#app-3',
	data: {
		nowtime: '点击获取当前时间'
    },
    computed: {
        getNowTime: function () {
            return new Date().toLocaleString();
        }
    },
	methods: {
        getComputedNowTime: function () {
            // 通过获取计算属性来更新日期
            this.nowtime = this.getNowTime;
            // 样式修改
            let timer = this.$refs.timer;
            timer.classList.add('text-success');
        }
	}
});

let app4 = new Vue({
	el: '#app-4',
	data: {
        test: '点击变化次数',
        counter: 0
    },
    computed: {
        testData: function () {
            this.counter++;
            return this.test;
        }
    },
	methods: {
        modifData: function () {
            // 尝试分两次对下方的语句进行修改，分别查看效果有什么区别
            // 1、修改这里的字符串为和当前不同的值
            // 2、将下方的“=”改写成“+=”
            this.test = "点击变化次数";
        }
	}
});

let app5 = new Vue({
	el: '#app-5',
	data: {
		firstName: 'Verning',
		lastName: 'Aulence',
		fullName: 'Verning Auelnce'
	},
	watch: {
		firstName: function (val) {
			this.fullName = val + ' ' + this.lastName
		},
		lastName: function (val) {
			this.fullName = this.firstName + ' ' + val
		}
	}
});

let app6 = new Vue({
	el: '#app-6',
	data: {
		firstName: 'Verning',
		lastName: 'Aulence'
	},
	computed: {
		fullName: function () {
			return this.firstName + ' ' + this.lastName
        }
        // 也可以写成
        /* fullName: {
            get: function() {
                return this.firstName + ' ' + this.lastName
            }
        } */
	}
});

let app7 = new Vue({
	el: '#app-7',
	data: {
		firstName: 'Verning',
		lastName: 'Aulence'
	},
	computed: {
		fullName: {
			// 通过该方法来将“计算”后的数据值返回给计算属性“fullName”，并更新到视图
			get: function() {
				return this.firstName + ' ' + this.lastName;
			},
			// 通过该方法的参数来获取视图内更改的值，并对数据模型内的数据进行设置
			set: function(newVal) {
                // 将获取到的get数据分割为一个数组来对两个数据进行新的赋值
                var names = newVal.split(' ');
                // 在这里就更新了数据模型的值，最终达到了双向数据绑定的要求
				this.firstName = names[0];
				this.lastName = names[names.length - 1];
            }
            // 简单来说，get返回的值更新fullName，set设置数据模型data
		}
	}
});

let app8 = new Vue({
	el: '#app-8',
	data: {
		question: '',
		answer: '你不问我，我就不给你答案！',
		getImg: ''
	},
	watch: {
		// 如果“question”发生改变，这个函数就会运行
		question: function () {
            this.answer = '等着你停止打字中...';
            // 调用自定义方法（内置lodash函数库，使用了axios AJAX封装插件）
			this.getAnswer();
		}
	},
	methods: {
		// “_.debounce”是一个通过lodash（函数插件）限制操作频率的函数
		// 在这个例子中，我们希望限制访问“yesno.wtf/api”这个地址JSON的频率
		// axios（Vue使用的ajax请求插件）请求直到用户输入完毕才会发出
		// _.debounce()方法是lodash.js这个库提供的一个延时函数，利用这个函数可以等待用操作完成后延时执行内容，从而减轻AJAX请求对服务器的负担
		getAnswer: _.debounce(function () {
				let qa = this;
				if (this.question.indexOf('?') === -1 && this.question.indexOf('？') === -1 ) {
					qa.answer = '输入的问题必须要包含“？”的哟';
					return;
				}
				qa.answer = '构思中...';
				axios.get('https://yesno.wtf/api')
					.then(function (response) {
						qa.answer = response.data.answer;
						qa.getImg = response.data.image;
					})
					.catch(function (error) {
						qa.answer = '错误！无法访问API。' + error;
					});
			},
		// 输入停止后多少毫秒执行函数
		1800)
	}
})