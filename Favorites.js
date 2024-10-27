import { GithubUser } from "./GithubUsers.js"

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load(){
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []



    }

    save(){
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username){

        try{
            const UserExists = this.entries.find(entry => entry.login === username)

            if(UserExists) {
                throw new Error(`You can't add the same user`)
            }

            const user = await GithubUser.search(username)

            if(user.login === undefined){
                throw new Error('User not found!')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch (error){
            alert(error.mesage)
        }
    }

    delete(user){ 
        const filteredEntries = this.entries.
        filter(entry => entry.login !== user.login
        )

        this.entries = filteredEntries
        this.update()
        this.save()

    }

}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        
        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
        
    }

    onadd(){
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const {value} = this.root.querySelector('.search input') // dentro desse input tem value que eh algo que ja vem de padrao, o value e o text que ta dentro, ai a gente so pega
                this.add(value)
           
        }

    }

    update() {
        this.removeAllTr()

  

    this.entries.forEach( user => {
        const row = this.createRow()
       
        
        row.querySelector('.user img').src = `https://github.com/${user.login}.png`

        row.querySelector('.user img').alt = `Imagem de ${user.name}`
        
        row.querySelector('.user a').href = `https://github.com/${user.login}`

        row.querySelector('.user p').textContent = user.name
        
        row.querySelector('.user span').textContent = user.login
        
        row.querySelector('.repositories ').textContent = user.public_repos
        
        row.querySelector('.Followers').textContent = user.followers

        row.querySelector('.remove').onclick = () => {
            const isOk = confirm('Tem certeza que deseja deletar essa linha?')
            if(isOk){
                this.delete(user)
            }
        }

        this.tbody.append(row)
    })

    }



    createRow(){
        const tr = document.createElement('tr')

        tr.innerHTML = `
        
                    <td class="user">
                        <img src="https://github.com/jvpascale.png" alt="Joao Pascale Image">
                        <a href="https://github.com/jvpascale" target="_blank">
                            <p>Joao Pascale</p>
                            <span>jvpascale</span>
                        </a>
                    </td>
                    <td class="repositories">
                        73
                    </td>
                    <td class="Followers">
                        965
                    </td>
                    <td>
                        <button class="remove">&times;</button>
                    </td>
               `

        return tr
    }

    removeAllTr() {
       

        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
                tr.remove()
            })
    }
}