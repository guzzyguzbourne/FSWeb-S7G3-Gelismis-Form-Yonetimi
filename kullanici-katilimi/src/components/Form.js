import React, {useState, useEffect} from "react";
import axios from 'axios';
import * as Yup from 'yup';

const url = "https://reqres.in/api/users" ;

const initialData = {
    isim: "",
    eposta: "",
    sifre: "",
    sartlar: false,
};

const initialErrors = {
    isim: "",
    eposta: "",
    sifre: "",
    sartlar: "",
};

const formSchema = Yup.object().shape(
    {
        isim :Yup.string()
                 .min(5, "İsim alanı en az 5 karakter olmalıdır")
                 .required("İsim alanını doldurmadınız."),
        eposta: Yup.string()
                    .email('Geçerli bir email adresi giriniz.')
                    .required('E-mail girmediniz'),
        sifre: Yup.string()
                  .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/, 'En az 8 karakter, 1 büyük 1 küçük harf 1 rakam 1 sembol içermelidir.')
                  .min(8, 'En az 8 karakter olmalıdır')
                  .required('Şifre alanı gereklidir.'),
        sartlar: Yup.boolean()
                    .oneOf([true], "Şartları kabul etmediniz.")
                    .required('Şifre alanı gereklidir.')               
    }
);

const Form = (props) => {

    const [formData, setFormData] = useState(initialData)
    const [errors, setErrors] = useState(initialErrors);
    const [isValid, setIsValid] = useState(false);

    const handlerSubmit = (event) =>{
        event.preventDefault();
        if(isValid){
            axios.post(url, formData)
            .then(response => {
                console.log(response)
                setFormData(initialData)
            })
            .catch(error => console.error(error)) 
        }else {
            alert("formu doldurduğunuza emin olunuz!.")
        }   
};

useEffect(()=>{
    formSchema.isValid(formData)
    .then((valid)=>{
        setIsValid(valid)}
        )   
    }, [formData]);

const handlerChange = (event) =>{
    let {name, type, value, checked} = event.target;
    value = (type === "checkbox") ? checked: value;
    setFormData({...formData, [name]: value })
    Yup.reach(formSchema, name)
        .validate(value)
        .then((success) => {
            setErrors({...errors, [name]: ""})
        })
        .catch(err => {
            setErrors({...errors, [name]: err.errors[0]})
        })
};

    return (
        <div>
            <form onSubmit={handlerSubmit}>
                <label>
                    Name: 
                <input
                type = "text"
                name = "isim"
                value = {formData.isim}
                onChange = {handlerChange}
                />
                </label>
                <p>{errors.isim}</p>
                <label>
                    E-mail: 
                <input
                type = "email"
                name = "eposta"
                value = {formData.eposta}
                onChange = {handlerChange}
                />
                </label>
                <p>{errors.eposta}</p>
                <label>
                    Password: 
                <input
                type = "password"
                name = "sifre"
                value = {formData.sifre}
                onChange = {handlerChange}
                />
                </label>
                <p>{errors.sifre}</p>
                <label>
                <input
                type = "checkbox"
                name = "sartlar"
                value = {formData.sartlar}
                onChange = {handlerChange}
                /> I accept the terms.
                </label>
                <p>{errors.sartlar}</p>
                <button disabled = {!isValid} >
                    Submit.
                </button>

            </form>
            
        </div>

    )

    
};
//style component'de görseli düzeltebiliriz!
export default Form;