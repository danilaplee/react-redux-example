import React, { Component } from 'react';
class Quiz extends Component {

  constructor(props) {
    super(props);
    this.store          = props.store;
    this.api            = props.api
    this.handleChange   = this.handleChange.bind(this);
    this.handleSubmit   = this.handleSubmit.bind(this);
    this.getVisibility  = this.getVisibility.bind(this);
    this.submitItem     = this.submitItem.bind(this);
    this.setVisibility  = this.setVisibility.bind(this);
    this.visibility     = this.setVisibility();
    this.showPreloader  = this.showPreloader.bind(this);
    this.hidePreloader  = this.hidePreloader.bind(this);
    this.loader         = null;
    this.preloading     = "hidden"
    this.params         = {
      a1:null,
      a2:null,
      b1:null,
      b2:null,
      text:"",
      c:null,
    }
  }
  
  componentDidMount() {
    this.setState({visibility:this.setVisibility()})
  }

  handleChange(event) {
    this.params.text = event.target.value
    this.setState({
      params:{
        text:event.target.value
      } 
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  getVisibility(attr) {
    const current = this.store.getState()
    const keys = Object.keys(current)
    const container = "container";
    const hidden = "hidden"; 
    for (var i = 0; i < keys.length; i++) {
      if(attr === keys[i]) {
        if(attr === "server_response" && current[keys[i]]) return container;
        if(i === 0 && current[keys[i]] == null) return container;
        if(current[keys[i]] != null) return container;
        if(current[keys[i-1]] != null) return container;
        else return hidden;
      }
    }
  }

  setVisibility() {
    if(this.loader) clearInterval(this.loader);
    this.visibility = {
      a:this.getVisibility("a"),
      b:this.getVisibility("b"),
      text:this.getVisibility("text"),
      c:this.getVisibility("c"),
      completed:this.getVisibility("completed"),
      done:this.getVisibility("server_response")
    }
    return this.visibility;
  }

  showPreloader() {
    const self = this
    return new Promise(function(resolve,reject){
      self.preloading = "container"
      self.setState({preloading:"container"}, function(){
        resolve()
      })
    })
  }

  hidePreloader() {
    const self = this
    return new Promise(function(resolve,reject){
      self.preloading = "hidden"
      self.setState({preloading:"hidden"}, function(){
        resolve()
      })
    })
  }

  submitItem(event) {
    const target  = event.target;
    const value   = target.type === 'checkbox' ? target.checked : target.value;
    const name    = target.name;
    const id      = target.id
    const self    = this;
    
    //DISPATCH A TO REDUX STORE
    if(name === "A1" || name === "A2") {
      if(value) this.store.dispatch({type:"FILL_A", a:name})
      else this.store.dispatch({type:"CLEAR_A", a:name})
    }

    //DISPATCH B TO REDUX STORE
    if(name === "B" && id === "B1") this.store.dispatch({type:"FILL_B", b:"B1"})
    if(name === "B" && id === "B2") this.store.dispatch({type:"FILL_B", b:"B2"})
    
    //DISPATCH TEXT TO API & THEN TO REDUX STORE
    if(name === "text") 
    {
      self.response = null;

      return self
      .showPreloader()
      .then(function()
      {
        return self.api.checkIt(self.params.text)
      })
      .then(function(result)
      {
        self.hidePreloader().then(function(){
          self.store.dispatch({type:"FILL_TEXT", text:self.params.text})
          self.setState({visibility:self.setVisibility()})
        })
      })
      .catch(function(err){

        self.hidePreloader().then(function(){
          self.store.dispatch({type:"DONE", server_response:err})
          self.response = "Error: "+err.message.toString();
          self.setState({visibility:self.setVisibility()})
        });
      })
    }

    //DISPATCH C TO REDUX STORE
    if(name === "C") this.store.dispatch({type:"FILL_C", c:value})

    //DISPATCH WHOLE FORM TO API
    if(name === "completed") 
    {
      self.response = null;
      const data = self.store.getState()
      return self
      .showPreloader()
      .then(function()
      {
        return self.api.submitIt(data)
      })
      .then(function(result)
      {
        self.hidePreloader().then(function(){
          self.response = "SUCCESS!"
          self.store.dispatch({type:"DONE", server_response:"SUCCESS"})
          self.setState({visibility:self.setVisibility()})
        })
      })
      .catch(function(err)
      {
        self.hidePreloader().then(function(){
          self.store.dispatch({type:"DONE", server_response:err})
          self.response = "Error: "+err.message.toString();
          self.setState({visibility:self.setVisibility()})
        });
      })
    }

    this.setState({visibility:this.setVisibility()})
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className={this.visibility.a}>
          <label>
            A1
            <input type="checkbox" name="A1" checked={this.params.a1} onChange={this.submitItem} />
          </label>
          <label>
            A2
            <input type="checkbox" name="A2" checked={this.params.a2} onChange={this.submitItem} />
          </label>
        </div>
        <div className={this.visibility.b}>
          <label>
            B1
            <input type="radio" name="B" id="B1" checked={this.params.b1} onChange={this.submitItem} />
          </label>
          <label>
            B2
            <input type="radio" name="B" id="B2" checked={this.params.b2} onChange={this.submitItem} />
          </label>

        </div>
        <div className={this.visibility.text}>
          <label>
            Text:
            <input type="text" value={this.params.text} onChange={this.handleChange}/>
          </label>
          <input type="submit" value="Check" name="text" onClick={this.submitItem} />
        </div>

        <div className={this.visibility.c}>
          <select name="C" onChange={this.submitItem}>
            <option value="C1">C1</option>
            <option value="C2">C2</option>
            <option value="C3">C3</option>
          </select>
        </div>
        <div className={this.visibility.completed}>
          <input type="submit" value="Submit" name="completed" onClick={this.submitItem} />
        </div>
        <div className={this.visibility.done}>
          <p className="red-font">{this.response}</p>
        </div>
        <div className="container">
          <div className={this.preloading}>
            <div class="loader-container">
              <div class="item item-1"></div>
              <div class="item item-2"></div>
              <div class="item item-3"></div>
              <div class="item item-4"></div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default Quiz;