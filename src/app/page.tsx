'use client'

import { Data } from "@/types/Data";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import React, { useEffect, useState } from "react";
import { Bell, Gauge, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
export default function Home() {

  const [items, setItems] = useState([]);

  const buzzeraction = (id: number, buzzerstatus: number) => {
    fetch('/api/client', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, buzzerstatus })
    })
  }

  const switchaction = (switchstatus: number) => {
    fetch('/api/client/switch', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ switchstatus })
    })
  }



  useEffect(() => {
    async function getUsers() {
      try {
        const res = await fetch('/api/client');
        if (!res.ok) {
          console.error('Failed to fetch data');
          return;
        }
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    getUsers()
    const interval = setInterval(getUsers, 4000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Sensor Data Display</h1>
      <div className="grid grid-cols-1 gap-4">
        {items.map((item: Data) => (
          <Card key={item.id} className="w-full">
            <CardHeader>
              <CardTitle>Sensor</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-center">
              <div className="flex items-center mb-4">
                <Volume2 className="mr-2 h-4 w-4" />
                <p className="text-sm font-medium">Ultrasonic Value:</p>
                <Badge variant="secondary" className="ml-auto">
                  {item.ultrasonic_value} cm
                </Badge>
              </div>
              <div className="flex items-center mb-4">
                <Bell className="mr-2 h-4 w-4" />
                <p className="text-sm font-medium">Buzzer Value:</p>
                <Badge
                  className="ml-auto"
                >
                  {item.buzzer_value} Hz
                </Badge>
              </div>
              <div>
                <Button className="w-full"
                  onClick={() => buzzeraction(item.id, item.buzzer_status == 0 ? 1 : 0)}
                >
                  {item.buzzer_status  == 0 ? "Buzzer ON" : "Buzzer OFF"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
