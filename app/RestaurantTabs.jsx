import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";



console.log({ Tabs, TabsContent, TabsList, TabsTrigger }); // Check the output

const RestaurantTabs = () => {
  return (
    <div>
      <Tabs defaultValue="Category" className="w-full mt-10">
        <TabsList>
          <TabsTrigger value="Category">Category</TabsTrigger>
          <TabsTrigger value="about">about</TabsTrigger>
          <TabsTrigger value="Review">ReView</TabsTrigger>
        </TabsList>
        <TabsContent value="Category">Category</TabsContent>
        <TabsContent value="about">about</TabsContent>
        <TabsContent value="Review">Review</TabsContent>
      </Tabs>
     
    </div>
  );
};

export default RestaurantTabs;
