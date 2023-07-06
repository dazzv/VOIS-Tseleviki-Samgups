const App = {
        data() {
            return {
                active : 'main',
                activeComponent: "news",
                authPanel: false,
                adminPanel: false,

                status: '',

                news: [],
                articles: [],
                
                Form: {
                    email: "",
                    password: ""
                },

                data: {
                    type: 'news',
                    title: '',
                    text: '',
                    organization: '',
                    icon: '',
                    author: '',
                    date: ''
                }
            }
        },

        methods: {
            selectForm(data){
                this.activeForm = data
            },

            async getData(){
               await axios.get('http://127.0.0.1:5000/news')
                .then((res)=> {
                    this.news = res.data
                }) .catch((err) =>{
                    console.error(err)
                })
               await axios.get('http://127.0.0.1:5000/articles')
                .then((res)=> {
                    this.articles = res.data
                }) .catch((err) =>{
                    console.error(err)
                })
            },

            sendAuthData() {
                if(this.Form.email && this.Form.password){
                    axios.post('http://127.0.0.1:5000/api/auth', {
                    email: this.Form.email,
                    password: this.Form.password
                    }, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    })
                    .then(response => {
                        const data = response.data
                        if(data.username){
                            this.status = 'admin'
                            alert(`Добро пожаловать ${data.username}! Доступ к панели администратора открыт!`)
                            
                            sessionStorage.status = this.status

                            this.Form.email = ''
                            this.Form.password = ''
                        } else {
                            this.status = 'error'
                            alert(response.data.message);
                        }

                    })
                    .catch(error => console.error(error))

                    this.authPanel = false

                } else {
                    alert("Заполните необходимые поля")
                }
                
            },
            async sendNewData() {
                data = this.data
                if (data.type == 'news'){
                    if(data.title && data.text && data.organization && data.icon){
                        console.log('ok news');
                        await axios.post('http://127.0.0.1:5000/newData/news', {
                            title: data.title,
                            text: data.text,
                            organization: data.organization,
                            icon: data.icon
                        }, {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        })
                        .then(response => console.log(response.data))
                        .catch(error => console.error(error))
                        
                        this.data.title = ''
                        this.data.text = ''
                        this.data.organization = ''
                        this.data.icon = ''
                        alert('Успешно добавлено!')
                    }
                } else if (data.type == 'articles'){
                    if(data.title && data.author && data.text && data.date){
                        console.log('ok articles');
                        await axios.post('http://127.0.0.1:5000/newData/articles', {
                            title: data.title,
                            author: data.author,
                            text: data.text,
                            date: data.date
                        }, {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        })
                        .then(response => console.log(response.data))
                        .catch(error => console.error(error))

                        this.data.title = ''
                        this.data.author = ''
                        this.data.text = ''
                        this.data.date = ''
                        alert('Успешно добавлено!')
                    }
                }
            },

            searchElement() {               
                let elements = document.querySelectorAll('.block');
               
                let word = this.search

                let capitalized =
                word.charAt(0).toUpperCase()
                + word.slice(1)

                let search = capitalized.trim()

                if (search != ''){
                    elements.forEach(function (elem) {
                        if (elem.innerText.search(search) == -1){
                            elem.classList.add('hide');
                        } else {
                            elem.classList.remove('hide');
                        }
                    })
                } else {
                     elements.forEach(function (elem) {
                       elem.classList.remove('hide')
                    })
                }
            },
        },

        mounted() {
            if(sessionStorage.status){
                this.status = sessionStorage.status
            } else {
                this.status = ''
            }
        },
        created() {
            this.getData()
        },



}

Vue.createApp(App).mount('#app')