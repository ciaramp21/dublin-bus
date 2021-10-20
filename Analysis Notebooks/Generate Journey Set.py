#!/usr/bin/env python
# coding: utf-8


# Imports and general data
import pandas as pd
import numpy as np


# ### Import Data & Create Features

trips_collist = ['DAYOFSERVICE', 'LINEID','ROUTEID','DIRECTION', 'PLANNEDTIME_DEP', 'TRIPID']
leavetimes_collist = ['PROGRNUMBER','STOPPOINTID', 'DAYOFSERVICE', 'ACTUALTIME_ARR', 'TRIPID']
distance_collist = ['STOPPOINTID', 'STOPID', 'PROGRNUMBER', 'DISTANCE_TRAVELLED']
weather_collist = ['temp', 'weather_main', 'dt']





# Import necessary data
trips_df = pd.read_csv('rt_trips_DB_2018.txt', sep=';', usecols=trips_collist) #choose only relevant columns
weather_df = pd.read_csv('Weather_2018.csv', usecols=weather_collist) #choose only relevant columns
distance_df = pd.read_csv('distance_all.csv', usecols=distance_collist) #choose only relevant columns Check if this is taken from the old records that was used previously or if anything is missing






# Adjust times from seconds to hh:mm:ss and get the expected and actual trip time
trips_df['DATE'] = pd.to_datetime(trips_df['DAYOFSERVICE']).dt.strftime('%Y-%m-%d')
trips_df['HOUR'] = pd.to_datetime(trips_df['PLANNEDTIME_DEP'], unit='s').dt.strftime("%H:00:00")
trips_df['DUMMY_DATE'] = pd.to_datetime(trips_df['DAYOFSERVICE']).dt.strftime('%Y%m%d')
trips_df['UNIQUEID'] = trips_df["DUMMY_DATE"].astype(str) + "_" + trips_df["TRIPID"].astype(str)

weather_df['DATE'] = pd.to_datetime(weather_df['dt'], unit='s').dt.strftime("%Y-%m-%d")
weather_df['HOUR'] = pd.to_datetime(weather_df['dt'], unit='s').dt.strftime("%H:%M:%S")


df = pd.DataFrame()


# Break data into chunks
for chunk in pd.read_csv('rt_leavetimes_DB_2018.txt', sep=';', usecols=leavetimes_collist, chunksize=1000000):
    
    leavetimes_df = chunk
    
    leavetimes_df['DUMMY_DATE'] = pd.to_datetime(leavetimes_df['DAYOFSERVICE']).dt.strftime('%Y%m%d')
    leavetimes_df['ACTUALTIME_ARR_TRIP'] = leavetimes_df['ACTUALTIME_ARR']
    leavetimes_df['UNIQUEID'] = leavetimes_df["DUMMY_DATE"].astype(str) + "_" + leavetimes_df["TRIPID"].astype(str)
   
    
    # Combine data tables and keep only the relevant headings
    result = pd.merge(trips_df[['DATE', 'LINEID','ROUTEID','DIRECTION',  'HOUR', 'UNIQUEID']],
                      leavetimes_df[['PROGRNUMBER','STOPPOINTID', 'ACTUALTIME_ARR_TRIP', 'UNIQUEID']],
                      on='UNIQUEID', 
                     how='left')
    
    
 
    
    
    result = pd.merge(result,
                      distance_df[['STOPPOINTID', 'STOPID', 'PROGRNUMBER', 'DISTANCE_TRAVELLED']],
                     on=['STOPPOINTID', 'PROGRNUMBER'],
                     how='left')
    
    
   
    
    
    result = pd.merge(result,
                      weather_df[['temp', 'weather_main', 'HOUR', 'DATE']],
                      on=['HOUR', 'DATE'],
                     how='left')
    
    
 
    
    
    result['DATE'] = pd.to_datetime(result['DATE'])
    result['WEEKDAY'] = result['DATE'].dt.day_name()
    
    
    # ### Set Relevant Columns and Order
    
    stop_detail = result.reindex(columns=['WEEKDAY', 'LINEID', 'ROUTEID', 'HOUR', 'DIRECTION', 'PROGRNUMBER',
                                     'ACTUALTIME_ARR_TRIP', 'STOPID', 'temp', 'weather_main', 'DISTANCE_TRAVELLED', 'UNIQUEID'])
    
    
   
    
    
    stop_detail = stop_detail.sort_values(by=['UNIQUEID', 'PROGRNUMBER'])
    
    
  
    
    stop_detail['DISTANCE_TRAVELLED'] = np.where(stop_detail['PROGRNUMBER'] == 1.0, 0.0, 
                                                 stop_detail['DISTANCE_TRAVELLED'])
    
    
  
    
    
    stop_detail = stop_detail.dropna(subset = ["DISTANCE_TRAVELLED"])
    
    
   
    
    
    stop_detail['DISTANCE_TRAVELLED'] = stop_detail['DISTANCE_TRAVELLED'].astype(str).str.replace(",", "").astype(float)
    
    
    # ### Generate New Mapping Data

    stop_detail = stop_detail[stop_detail['UNIQUEID'].map(stop_detail['UNIQUEID'].value_counts()) > 10]
    
    
    dummy_journeys = stop_detail.groupby('UNIQUEID').apply(pd.DataFrame.sample, 
                                                           n=10).reset_index(drop=True)
    
    
    dummy_journeys['trip_index']= (dummy_journeys.index / 2 + 1).astype(int)
    
    
    dummy_journeys = dummy_journeys.sort_values(by=['UNIQUEID', 'trip_index', 'PROGRNUMBER'])
    
    
    dummy_journeys["UNIQUEID"] = dummy_journeys["UNIQUEID"] + "_" + dummy_journeys["trip_index"].astype(str)
    
    
    # ### Generate New Feature Columns
    
   
    
    dummy_journeys['PREVIOUS_ID'] = dummy_journeys['UNIQUEID'].shift(periods=1)
    
    
  
    
    
    dummy_journeys['previous_stop_dist'] = dummy_journeys['DISTANCE_TRAVELLED'].shift(periods=1)
    
    
  
    
    
    dummy_journeys['PREV_STOPID'] = dummy_journeys['STOPID'].shift(periods=1)
    
    
    
    
    
    dummy_journeys['PREV_PROGRNUMBER'] = dummy_journeys['PROGRNUMBER'].shift(periods=1)
    
    
  
    
    
    dummy_journeys['PREV_TIME'] = dummy_journeys['ACTUALTIME_ARR_TRIP'].shift(periods=1)
    
    
 
    
    dummy_journeys = dummy_journeys.where(dummy_journeys['UNIQUEID'] == dummy_journeys['PREVIOUS_ID'])
    
    
 
    
    
    dummy_journeys['DIST_BETWEEN'] = (dummy_journeys['DISTANCE_TRAVELLED'] - 
                                      dummy_journeys['previous_stop_dist']).where(dummy_journeys['UNIQUEID'] == dummy_journeys['PREVIOUS_ID'])
    
    

    
    dummy_journeys['STOPS_BETWEEN'] = (dummy_journeys['PROGRNUMBER']-dummy_journeys['PREV_PROGRNUMBER']).where(dummy_journeys['UNIQUEID'] == dummy_journeys['PREVIOUS_ID'])
    
    
 
    
    
    dummy_journeys['JOURNEY_TIME'] = (dummy_journeys['ACTUALTIME_ARR_TRIP']-dummy_journeys['PREV_TIME']).where(dummy_journeys['UNIQUEID'] == dummy_journeys['PREVIOUS_ID'])
    
    
   
    
    dummy_journeys.dropna(subset = ["STOPID"], inplace=True)
    
    

    
    dummy_journeys = dummy_journeys[['WEEKDAY', 'LINEID', 'HOUR',  
                                     'ROUTEID', 'DIRECTION', 'DIST_BETWEEN', 
                                     'STOPS_BETWEEN', 'temp', 
                                     'weather_main', 'JOURNEY_TIME']]
    
    df = df.append(dummy_journeys, ignore_index = True)
    

df.to_csv("dummy_journeys.csv")





