# -*- coding: utf-8 -*-
"""
Created on Wed Jun 23 23:57:01 2021

@author: turlough cooke
"""
import pandas as pd

# Import data
leavetimes_df = pd.read_csv(r'C:\Users\turlo\OneDrive\Documents\MSC_Computer_Science\Summer_Project\Data\DublinBus_2018\leavetimes_trim.csv')
stops_df = pd.read_csv(r'C:\Users\turlo\OneDrive\Documents\MSC_Computer_Science\Summer_Project\Data\DublinBus_2018\stops_trim.csv')
trips_df = pd.read_csv(r'C:\Users\turlo\OneDrive\Documents\MSC_Computer_Science\Summer_Project\Data\DublinBus_2018\trips_trim.csv')
vehicles_df = pd.read_csv(r'C:\Users\turlo\OneDrive\Documents\MSC_Computer_Science\Summer_Project\Data\DublinBus_2018\vehicles_trim.csv')
distance_df = pd.read_csv(r'C:\Users\turlo\OneDrive\Documents\MSC_Computer_Science\Summer_Project\Data\DublinBus_2018\distance_trim.csv')

# Adjust times from seconds to hh:mm:ss and get the expected and actual trip time
trips_df['PLANNEDTIME_ARR'] = pd.to_timedelta(trips_df['PLANNEDTIME_ARR'], 's')
trips_df['PLANNEDTIME_DEP'] = pd.to_timedelta(trips_df['PLANNEDTIME_DEP'], 's')
trips_df['ACTUALTIME_ARR'] = pd.to_timedelta(trips_df['ACTUALTIME_ARR'], 's')
trips_df['ACTUALTIME_DEP'] = pd.to_timedelta(trips_df['ACTUALTIME_DEP'], 's')

leavetimes_df['PLANNEDTIME_ARR'] = pd.to_timedelta(leavetimes_df['PLANNEDTIME_ARR'], 's')
leavetimes_df['PLANNEDTIME_DEP'] = pd.to_timedelta(leavetimes_df['PLANNEDTIME_DEP'], 's')
leavetimes_df['ACTUALTIME_ARR'] = pd.to_timedelta(leavetimes_df['ACTUALTIME_ARR'], 's')
leavetimes_df['ACTUALTIME_DEP'] = pd.to_timedelta(leavetimes_df['ACTUALTIME_DEP'], 's')

trips_df['PLANNEDTIME'] = trips_df['PLANNEDTIME_ARR'] - trips_df['PLANNEDTIME_DEP']
trips_df['ACTUALTIME'] = trips_df['ACTUALTIME_ARR'] - trips_df['ACTUALTIME_DEP']

# Combine data tables and keep only the relevant headings
result = pd.merge(trips_df[['DAYOFSERVICE','TRIPID','LINEID','ROUTEID','DIRECTION','PLANNEDTIME','ACTUALTIME']],
                  leavetimes_df[['PROGRNUMBER','STOPPOINTID','PLANNEDTIME_ARR','PLANNEDTIME_DEP','ACTUALTIME_ARR','ACTUALTIME_DEP', 'TRIPID']],
                 on='TRIPID',
                 how='left')

result = pd.merge(result,
                  stops_df[['STOPID','STOPNAME','STOPLAT','STOPLON','STOPPOINTID']],
                 on='STOPPOINTID',
                 how='left')

result = pd.merge(result,
                  distance_df,
                 on='STOPID',
                 how='left')

# Sort the results to make it more human readable
result['DAYOFSERVICE'] = pd.to_datetime(result['DAYOFSERVICE'])
result['WEEKDAY'] = result['DAYOFSERVICE'].dt.day_name()
result = result.sort_values(by=['TRIPID', 'PROGRNUMBER'])



