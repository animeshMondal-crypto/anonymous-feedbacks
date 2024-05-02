"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { messageSchema } from "@/schemas/messageSchema";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useCompletion } from "ai/react";

function SendMessage() {
  const { username } = useParams();
  const { completion, setCompletion, complete, isLoading } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion:
      "What's your favorite movie? || Do you have any pets?|| What's your dream job?",
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });
  const {
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = form;
  const watchMessage = watch("content");
  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setValue("content", "");

    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content: data.content,
      });

      if (response.data.success) {
        toast({
          title: response.data.message,
        });
        reset();
      }
    } catch (error) {
      console.error("message sent error ", error);
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "Failed",
        description:
          axiosError.response?.data.message || "Message Sending Failed",
        variant: "destructive",
      });
    }
  };

  const handleButtonClick = async () => {
    const res = await complete("");
    if (res) {
      setCompletion(res);
    } else {
      toast({
        title: "Something Went Wrong",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    setValue("content", "");
  }, [setValue]);

  return (
    <div className="w-full my-12">
      <div className="flex flex-col gap-8 justify-center items-center">
        <h1 className="font-bold text-4xl">Public Profile Link</h1>

        <div className="w-3/5 space-y-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full flex justify-center">
                <Button type="submit" disabled={!watchMessage}>
                  {isSubmitting ? "Please Wait" : "Send It"}
                  {isSubmitting && <Loader2 className="animate-spin" />}
                </Button>
              </div>
            </form>
          </Form>
          <div className="space-y-5">
            <Button onClick={handleButtonClick} disabled={isLoading}>
              Suggest Messages
              {isLoading && <Loader2 className="animate-spin" />}
            </Button>
            <p>Click on any message below to select it.</p>
            <div className="flex flex-col gap-5 border p-6 rounded-lg">
              <h1 className="font-semibold text-xl">Messages</h1>
              {completion.split("||").map((m, i) => (
                <Button
                  variant="outline"
                  key={i}
                  onClick={() => {
                    setValue("content", m);
                  }}
                >
                  {m}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-5">
            <h1>Get Your Message Board</h1>
            <Button>
              <Link href="/sign-up">Create Your Account</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SendMessage;
