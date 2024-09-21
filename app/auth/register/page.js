'use client';

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import api from '../../utils/api';
import { FaGoogle, FaFacebook, FaTwitter } from 'react-icons/fa';

export default function Register() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const router = useRouter();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const { confirmPassword, ...dataToSend } = data;
      const response = await api.post('/users/register', dataToSend);
      if (response.data.success) {
        console.log("Inscription réussie");
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
          api.setAuthToken(response.data.token);
        }
        router.push('/');
      } else {
        setSubmitError("L'inscription a échoué. Veuillez réessayer.");
      }
    } catch (error) {
      setSubmitError(error.response?.data?.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 text-green-800">Inscription</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 text-green-800">Nom complet</label>
          <input
            {...register("firstName", { required: "Le nom est obligatoire" })}
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 text-green-800">Email</label>
          <input
            {...register("email", {
              required: "L'email est obligatoire",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Adresse email invalide"
              }
            })}
            type="email"
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 text-green-800">Mot de passe</label>
          <input
            {...register("password", {
              required: "Le mot de passe est obligatoire",
              minLength: {
                value: 8,
                message: "Le mot de passe doit contenir au moins 8 caractères"
              }
            })}
            type="password"
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block mb-1 text-green-800">Confirmer le mot de passe</label>
          <input
            {...register("confirmPassword", {
              required: "Veuillez confirmer votre mot de passe",
              validate: (value) => value === watch('password') || "Les mots de passe ne correspondent pas"
            })}
            type="password"
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
        </div>

        {submitError && <p className="text-red-500 text-sm">{submitError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 transition duration-300"
        >
          {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
        </button>
      </form>

      <div className="mt-6">
        <p className="text-center text-gray-600 mb-4">Ou inscrivez-vous avec</p>
        <div className="flex justify-center space-x-4">
          <button className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300">
            <FaGoogle className="w-6 h-6" />
          </button>
          <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300">
            <FaFacebook className="w-6 h-6" />
          </button>
          <button className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition duration-300">
            <FaTwitter className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}