@@ .. @@
 // Validation schema
 const loginSchema = z.object({
-  password: z.string().min(8, "Password must be at least 8 characters"),
+  email: z.string().email("Please enter a valid email address"),
 });

 type LoginFormValues = z.infer<typeof loginSchema>;
@@ .. @@
   // Initialize react-hook-form
   const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
     resolver: zodResolver(loginSchema),
     defaultValues: {
-      password: ''
+      email: 'monti@greyed.org'
     }
   });
@@ .. @@
   const onSubmit = async (data: LoginFormValues) => {
     setIsSubmitting(true);
     setLoginError(null);
     
     try {
-      const { error } = await signIn(adminEmail, data.password);
+      const { error } = await signIn(data.email);
       
       if (error) {
-        setLoginError("Invalid password. Please try again.");
+        setLoginError("Unable to access admin account. Please try again.");
         setIsSubmitting(false);
         return;
@@ .. @@
       setLoginError("An unexpected error occurred. Please try again.");
       setIsSubmitting(false);
     }
   };
@@ .. @@
               <form onSubmit={handleSubmit(onSubmit)}>
                 <div className="mb-5">
                   <label className="block text-sm font-medium text-primary mb-1">
                     Email Address
                   </label>
-                  <div className="w-full px-3 py-2 border border-primary/20 rounded-lg bg-primary/5 text-primary">
-                    <div className="flex items-center">
-                      <Mail className="h-5 w-5 mr-2 text-primary/50" />
-                      {adminEmail}
-                    </div>
+                  <div className="relative">
+                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
+                      <Mail className="h-5 w-5 text-primary/30" />
+                    </div>
+                    <input
+                      id="email"
+                      type="email"
+                      {...register("email")}
+                      className={`w-full pl-10 pr-4 py-2 border ${errors.email ? 'border-red-500' : 'border-primary/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-accent`}
+                      placeholder="admin@greyed.org"
+                      autoFocus
+                    />
                   </div>
-                </div>
-                
-                <div className="mb-6">
-                  <label htmlFor="password" className="block text-sm font-medium text-primary mb-1">
-                    Password
-                  </label>
-                  <div className="relative">
-                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
-                      <Lock className="h-5 w-5 text-primary/30" />
-                    </div>
-                    <input
-                      id="password"
-                      type="password"
-                      {...register("password")}
-                      className={`w-full pl-10 pr-4 py-2 border ${errors.password ? 'border-red-500' : 'border-primary/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-accent`}
-                      placeholder="Enter password"
-                      autoFocus
-                    />
-                  </div>
-                  {errors.password && (
-                    <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
+                  {errors.email && (
+                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                   )}
                 </div>
                 
@@ -180,7 +167,7 @@
                   ) : (
                     'Log In'
                   )}
                 </button>
               </form>
             </div>
           </motion.div>