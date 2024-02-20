import { Server } from '@overnightjs/core';
import { TestController } from './controllers/test';

class App extends Server {

    constructor(){
        super();
        super.addControllers([new TestController()])
    }
    port = 2000;
    public start() {
        this.app.listen(this.port, () => {
            console.log("Server ready at port: " + this.port);
        })
    }
}

export default App;
