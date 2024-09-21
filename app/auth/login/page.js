'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaGoogle, FaFacebook, FaTwitter } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import api from '../../utils/api';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const response = await api.post('/users/login', data);
      console.log("Réponse du serveur:", response);

      if (response.data && response.data.success) {
        console.log("Connexion réussie");
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        // Suppression de la ligne api.setAuthToken(response.data.token);
        router.push('/');
      } else {
        console.log("Échec de la connexion:", response.data);
        setSubmitError(response.data?.message || "La connexion a échoué. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      if (error.response) {
        if (error.response.status === 403) {
          setSubmitError("Veuillez vérifier votre compte avant de vous connecter.");
        } else {
          setSubmitError(error.response.data?.message || "Une erreur est survenue lors de la connexion.");
        }
      } else {
        setSubmitError("Une erreur de réseau est survenue. Veuillez réessayer.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Connexion</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            {...register("email", { required: "L'email est requis", pattern: { value: /^\S+@\S+$/i, message: "Email invalide" } })}
            className="w-full p-2 border rounded"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block mb-1">Mot de passe</label>
          <input
            type="password"
            {...register("password", { required: "Le mot de passe est requis" })}
            className="w-full p-2 border rounded"
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>

        {submitError && <p className="text-red-500">{submitError}</p>}

        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>

      <div className="mt-6">
        <p className="text-center text-gray-600 mb-4">Ou connectez-vous avec</p>
        <div className="flex justify-center space-x-4">
          <button className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600">
            <FaGoogle className="w-6 h-6" />
          </button>
          <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
            <FaFacebook className="w-6 h-6" />
          </button>
          <button className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500">
            <FaTwitter className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;