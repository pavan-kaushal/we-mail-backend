import { Server } from '@overnightjs/core';
class App extends Server {
    port = 2000;
    public start() {
        this.app.listen(this.port, () => {
            console.log("Server ready at port: " + this.port);
        })
    }
}

export default App;
