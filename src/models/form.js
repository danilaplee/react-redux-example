const initForm = {
  a: null,
  b: null,
  text: null,
  c: null,
  completed: null,
  server_response:null,
}

const Form = (state = initForm, action) => {
  switch (action.type) {
  	
    case 'INIT_FORM':
      	return initForm;

    case 'FILL_A':
      if(state.a && state.a.length === 1) state.a.push(action.a)
    	else state.a = [action.a];
    	return state;

    case 'CLEAR_A':
      if(state.a.length === 1) state.a = null;
      if(state.a && state.a[0] === action.a) state.a = [state.a[1]];
      if(state.a && state.a[1] === action.a) state.a = [state.a[0]];
      return state;
      
    case 'FILL_B':
    	state.b = action.b;
    	return state;

    case 'FILL_C':
    	state.c = action.c;
    	return state;

    case 'FILL_TEXT':
    	state.text = action.text;
      state.server_response = action.server_response
    	return state;

    case 'DONE':
    	state.server_response = action.server_response
    	return state;

    default:
      return state
  }
}

export default Form;