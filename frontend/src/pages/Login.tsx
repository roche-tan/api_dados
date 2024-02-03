import { useNavigate } from 'react-router-dom';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select';

const loginSchema = z
  .object({
    name: z
      .string()
      .regex(/^[a-zA-Z\s]*$/, { message: 'Name must contain only letters' })
      .optional(),
    password: z.string().optional(),
    passwordConfirm: z.string().optional(),
    accountType: z.enum(['personal', 'anonym']),
    anonymType: z.string().optional()
  })
  .refine(
    (data) => {
      if (data.accountType === 'personal') {
        // Verificar que la contraseña no esté vacía y tenga la longitud mínima para cuentas personales
        return data.password && data.password.length >= 3;
      }
      return true;
    },
    {
      message: 'Password required',
      path: ['password']
    }
  )

  .refine(
    (data) => {
      if (data.accountType === 'personal') {
        // Verificar que la confirmación de contraseña no esté vacía para cuentas personales
        return data.passwordConfirm && data.passwordConfirm.length >= 3;
      }
      return true;
    },
    {
      message: 'Passwords must match',
      path: ['passwordConfirm']
    }
  )

  .refine(
    (data) => {
      if (
        data.accountType === 'personal' &&
        data.password &&
        data.passwordConfirm
      ) {
        // Verificar que las contraseñas coincidan para cuentas personales
        return data.password === data.passwordConfirm;
      }
      return true;
    },
    {
      message: 'Passwords must match',
      path: ['passwordConfirm']
    }
  )

  .refine(
    (data) => {
      if (data.accountType === 'personal') {
        // Verificar que el nombre no esté vacío para cuentas personales
        return data.name && data.name.length >= 1;
      }
      return true;
    },
    {
      message: 'Name is required for personal accounts',
      path: ['name']
    }
  );

function Login() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: '',
      password: '',
      passwordConfirm: ''
    }
  });
  const accountType = form.watch('accountType');

  const handleSubmit = (values: z.infer<typeof loginSchema>) => {
    console.log({ values });
    console.log('Errores del formulario:', form.formState.errors);
    navigate('/dashboard');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-24">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="max-w-md w-full flex flex-col space-y-4"
        >
          <FormField
            control={form.control}
            name="accountType"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Account type</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder=" Select account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="anonym">Anonym</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          {accountType === 'personal' && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>👤 Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          )}
          {accountType !== 'anonym' && (
            <>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>🔑 Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>✅ Password Confirm</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password confirm"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </>
          )}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Form>
    </main>
  );
}

export default Login;
