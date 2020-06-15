import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {FiArrowLeft} from 'react-icons/fi'
import {Map, TileLayer, Marker }from 'react-leaflet' //Opcoes do mapa
import {LeafletMouseEvent} from 'leaflet' //Evento do mouse
import axios from 'axios'

import './styles.css'
import api from '../../services/api'
import logo from '../../assets/logo.svg'
import Dropzone from '../../Components/Dropzone'

interface Item{
  id: number;
  title: string;
  image_url: string;
}
interface IBGECity{
  nome: string
}

const Point = () => {
  //Armazenar os items do bando de dados
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [citys, setcity] = useState<string[]>([]);

  //Armazenar o estado e cidade selecionado
  const [selectedUf, setselectedUf] = useState('0');
  const [selectedCity, setselectedCity] = useState('0');
  const [selectedItems, setselectedItems] = useState<number[]>([]);
  const [selectedIFile, setselectedFile] = useState<File>();
  
  const [inicialPosition, setinicialPosition] = useState<[number, number]>([0,0]);
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      whatsapp: '',
  });
  //Armazenar latitute e longitude
  const [selectedPosition, setselectedPosition] = useState<[number, number]>([0,0]);
  const history = useHistory();

  //Carregando a posicao atual do usuario
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const {latitude, longitude} = position.coords

      setinicialPosition([latitude, longitude])
    })
  }, [])
  //Carregando os items do banco de dados
  useEffect(() => {
    api.get('items').then(response => {
        setItems(response.data)
    })
  }, []); 
  //Carregando os estados do banco de dados do ibge
  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
        const ufInitials = response.data.map(uf => uf.sigla)
        setUfs(ufInitials);
    })
  }, []); 

  //Carregando os estados do banco de dados do ibge
  useEffect(() => {
    axios.get<IBGECity[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
    const cityNames = response.data.map(city => city.nome)
    setcity(cityNames)
    })
  }, [selectedUf]); //Executa somente quando a selectedUf muda

  //pegando o event do uf
  function handleSelectUf(event: ChangeEvent<HTMLSelectElement> ){
    const uf = (event.target.value);
    
    setselectedUf(uf);
  }
  function handleSelectCity(event: ChangeEvent<HTMLSelectElement> ){
    const city = (event.target.value);
    setselectedCity(city);
  }
  function handleMapClick(event: LeafletMouseEvent){ //Event de latitude e long
      setselectedPosition([
        event.latlng.lat,
        event.latlng.lng
      ]);
  }
  //Armazenando a mudanca no input
  function handleInputChange(event: ChangeEvent<HTMLInputElement>){
      const {name, value } =  event.target //Pegando o nome e o valor de dentro do input
        setFormData({ ...formData , [name]: value})
  }

  function handleItems(id: number){
    //Verificando se o item ja foi selecionado
    const alreadySelected = selectedItems.findIndex(item => item === id);
    if( alreadySelected >= 0){
      //Filtrando os items e tirando o que ja estava na lista
        const filteredItems = selectedItems.filter(item => item !== id)
        setselectedItems(filteredItems);
      }
    else{
      setselectedItems([...selectedItems, id])
    } 
  }
   async function handleSubmit(event: FormEvent){
      event.preventDefault();


      const {name, email, whatsapp} = formData;
      const uf = selectedUf;
      const city = selectedCity;
      const [latitute , longitude] = selectedPosition;
      const items = selectedItems;

      const data = new FormData()
        //Para conseguir passar a iagem do tipo File
        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('uf', uf);
        data.append('city', city);
        data.append('latitute', String(latitute));
        data.append('longitude', String(longitude));
        data.append('items', items.join(','));

        if( selectedIFile) {
          data.append('image', selectedIFile);
        }

        await api.post('points', data);

        alert('Ponto de coleta criado!');
        history.push('/');
     
  }

    return(
      <div id = "page-create-point">
        <header>
          <img src= {logo} alt = "Ecoleta"/> 

          <Link to = "/">
          <FiArrowLeft/>
            Voltar Para Home
          </Link>
        </header>

      <form onSubmit = {handleSubmit}>
        <h1>Cadastro do <br/>ponto de coleta</h1>

      <Dropzone onFileUploaded = {setselectedFile}/>

      <fieldset>
        <legend>
          <h2>Dados</h2>
        </legend>

        <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input 
              type= "text" 
              name = "name" 
              id = "name"
              onChange = {handleInputChange}
              />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input 
                type= "text" 
                name = "email" 
                id = "email"
                onChange = {handleInputChange}
              />
         
            </div>

            <div className="field">
              <label htmlFor="Whatsapp">Whatsapp</label>
              <input 
                type= "text" 
                name = "whatsapp" 
                id = "Whatsapp"
                onChange = {handleInputChange}
              />
            </div>
          </div>
         
      </fieldset>

      <fieldset>
        <legend>
          <h2>Endereço</h2>
          <span>Selecione o endereço no mapa</span>
        </legend>

        <Map center={[-17.8660027, -41.5033112 ]} zoom= {16} onClick={handleMapClick}>

          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={selectedPosition}/>
        </Map>

        <div className= "field-group">
          <div className= "field">
            <label htmlFor = "uf"> Estado </label>
            <select name = "uf" id="uf" value={selectedUf} onChange = {handleSelectUf}> 
            <option value="0"> Selecione um estado </option>
            {ufs.map(uf => (
                 <option key = {uf} value= {uf}> {uf} </option>
              
            ))}
            </select>
           
          </div> 

          <div className= "field">
            <label htmlFor = "cidade"> Cidade </label>
            <select name = "cidade" id="cidade" value = {selectedCity} onChange={handleSelectCity} >
            <option value="0"> Selecione uma cidade </option>
            {citys.map(city => (
                 <option key= {city} value= {city}> {city} </option>
              
            ))}
            </select>
          </div> 

        </div>
      </fieldset>

      <fieldset>
        <legend>
          <h2>Itens de Coleta</h2>
          <span>Selecione um ou mais intens</span>
        </legend>

        <ul className ="items-grid">
          {items.map(item => (
            <li key = {item.id} 
                onClick = { () => handleItems(item.id)}
                className = {selectedItems.includes(item.id) ? 'selected' : ''}

                >
            <img src = {item.image_url} alt = ""/>
          <span>{item.title}</span>
            </li>
          ))}
          
        </ul>
      </fieldset>

      <button type = "submit"> Cadastrar ponto de coleta </button>
      </form>
      </div>
    );
  }
export default Point