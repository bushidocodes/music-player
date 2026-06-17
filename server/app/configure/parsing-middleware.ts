import express from 'express';
import type { ConfiguredApp } from '../types.js';

export default function (app: ConfiguredApp) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
}
