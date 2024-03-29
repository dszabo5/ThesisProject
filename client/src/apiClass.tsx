import axios, { AxiosResponse } from "axios";

const FLASK_URL: string = "http://localhost:5001"; //the default port for Flask

const apiClass = {
    // Allows us to submit a document with which to query the Model
    login: function(my_abst: string): Promise<AxiosResponse<any>> {
        console.log("activating axios");
        return axios.post(`${FLASK_URL}/login`, {
            abstract: my_abst
        });
    },
    // In case we don't have an abstract on hand, pull a random one!
    register: function(): Promise<AxiosResponse<any>> {
        console.log("getting random");
        return axios.get(`${FLASK_URL}/register`);
    },
    // We want to get similar documents to our abstract   
    upload: function(my_abst: string): Promise<AxiosResponse<any>> {
        console.log("getting similars");
        return axios.post(`${FLASK_URL}/get_similars`, {
            abstract: my_abst
        });
    },
    // Allows us to submit a document with which to query the Model
    postAbst: function(my_abst: string): Promise<AxiosResponse<any>> {
        console.log("activating axios");
        return axios.post(`${FLASK_URL}/abst_subm`, {
            abstract: my_abst
        });
    },
    // In case we don't have an abstract on hand, pull a random one!
    getRandom: function(): Promise<AxiosResponse<any>> {
        console.log("getting random");
        return axios.get(`${FLASK_URL}/get_rand_abst`);
    },
    // We want to get similar documents to our abstract   
    getSimilars: function(my_abst: string): Promise<AxiosResponse<any>> {
        console.log("getting similars");
        return axios.post(`${FLASK_URL}/get_similars`, {
            abstract: my_abst
        });
    }
};

export { apiClass };